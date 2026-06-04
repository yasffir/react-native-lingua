import { useAuth, useUser } from "@clerk/expo";
import type { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useEffect, useRef, useState } from "react";

import { ACHIEVEMENTS, type AchievementDefinition } from "@/data/achievements";
import { useSupabase } from "@/hooks/useSupabase";
import { isSupabaseConfigured } from "@/lib/config";
import { getNewlyUnlockedAchievementIds } from "@/lib/progress/achievements";
import { getLast7Days, toDateKey } from "@/lib/progress/dates";
import { getLeagueFromTotalXp, type LeagueTier } from "@/lib/progress/league";
import {
  getProgressSchemaSupport,
  isProgressSchemaError,
  logProgressMigrationHintOnce,
  markProgressSchemaSupport,
} from "@/lib/progress/schemaSupport";
import { calculateNextStreak } from "@/lib/progress/streak";
import { TABLES } from "@/lib/supabase/tables";

export interface WeekXpPoint {
  day: string;
  label: string;
  xp: number;
}

export interface UnlockedAchievement {
  id: string;
  unlockedAt: string;
  definition: AchievementDefinition;
}

const DEFAULT_STATS = {
  xpToday: 0,
  dailyGoal: 20,
  streak: 0,
  totalXp: 0,
};

function statsSelectColumns(): string {
  const { lastActivityDate } = getProgressSchemaSupport();
  return lastActivityDate
    ? "xp_today, daily_goal, streak, total_xp, last_activity_date"
    : "xp_today, daily_goal, streak, total_xp";
}

function applyStatsSchemaError(error: PostgrestError | null): void {
  if (error?.code === "42703" && error.message?.includes("last_activity_date")) {
    markProgressSchemaSupport({ lastActivityDate: false });
    logProgressMigrationHintOnce();
  }
}

function applyTableSchemaError(
  error: PostgrestError | null,
  table: "xpDaily" | "achievements"
): void {
  if (!isProgressSchemaError(error)) return;
  if (table === "xpDaily") markProgressSchemaSupport({ xpDaily: false });
  if (table === "achievements") markProgressSchemaSupport({ achievements: false });
  logProgressMigrationHintOnce();
}

async function addDailyXp(
  client: SupabaseClient,
  userId: string,
  amount: number,
  day: string,
  fallbackXpToday: number
): Promise<number> {
  const { xpDaily } = getProgressSchemaSupport();
  if (!xpDaily) {
    return fallbackXpToday + amount;
  }

  const { data: existing, error: readError } = await client
    .from(TABLES.xpDaily)
    .select("xp")
    .eq("clerk_user_id", userId)
    .eq("day", day)
    .maybeSingle();

  if (readError) {
    applyTableSchemaError(readError, "xpDaily");
    return fallbackXpToday + amount;
  }

  const nextXp = (existing?.xp ?? 0) + amount;

  const { error } = await client.from(TABLES.xpDaily).upsert(
    {
      clerk_user_id: userId,
      day,
      xp: nextXp,
    },
    { onConflict: "clerk_user_id,day" }
  );

  if (error) {
    applyTableSchemaError(error, "xpDaily");
    return fallbackXpToday + amount;
  }
  return nextXp;
}

async function syncAchievements(
  client: SupabaseClient,
  userId: string,
  snapshot: {
    streak: number;
    totalXp: number;
    completedLessonCount: number;
    xpToday: number;
    dailyGoal: number;
  },
  existingIds: string[]
): Promise<string[]> {
  if (!getProgressSchemaSupport().achievements) return existingIds;

  const newIds = getNewlyUnlockedAchievementIds(snapshot, existingIds);
  if (newIds.length === 0) return existingIds;

  const { error } = await client.from(TABLES.userAchievements).upsert(
    newIds.map((id) => ({
      clerk_user_id: userId,
      achievement_id: id,
      unlocked_at: new Date().toISOString(),
    })),
    { onConflict: "clerk_user_id,achievement_id", ignoreDuplicates: true }
  );

  if (error) {
    applyTableSchemaError(error, "achievements");
    return existingIds;
  }
  return [...existingIds, ...newIds];
}

export function useLearningProgress() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const userId = user?.id;
  const supabase = useSupabase();
  const supabaseRef = useRef(supabase);
  supabaseRef.current = supabase;

  const [xpToday, setXpToday] = useState(DEFAULT_STATS.xpToday);
  const [dailyGoal, setDailyGoal] = useState(DEFAULT_STATS.dailyGoal);
  const [streak, setStreak] = useState(DEFAULT_STATS.streak);
  const [totalXp, setTotalXp] = useState(DEFAULT_STATS.totalXp);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [weekXp, setWeekXp] = useState<WeekXpPoint[]>(() =>
    getLast7Days().map((d) => ({ ...d, xp: 0 }))
  );
  const [league, setLeague] = useState<LeagueTier>(() =>
    getLeagueFromTotalXp(0)
  );
  const [unlockedAchievements, setUnlockedAchievements] = useState<
    UnlockedAchievement[]
  >([]);
  const [loading, setLoading] = useState(
    Boolean(isSupabaseConfigured && isSignedIn)
  );
  const [error, setError] = useState<string | null>(null);
  const loadedUserRef = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSignedIn || !userId) {
      setXpToday(DEFAULT_STATS.xpToday);
      setDailyGoal(DEFAULT_STATS.dailyGoal);
      setStreak(DEFAULT_STATS.streak);
      setTotalXp(DEFAULT_STATS.totalXp);
      setCompletedLessonIds([]);
      setWeekXp(getLast7Days().map((d) => ({ ...d, xp: 0 })));
      setLeague(getLeagueFromTotalXp(0));
      setUnlockedAchievements([]);
      setLoading(false);
      loadedUserRef.current = null;
      return;
    }

    const client = supabaseRef.current;
    if (!isSupabaseConfigured || !client) {
      setLoading(false);
      return;
    }

    const isInitialLoad = loadedUserRef.current !== userId;
    if (isInitialLoad) setLoading(true);
    setError(null);

    const today = toDateKey(new Date());
    const last7 = getLast7Days();
    const fromDay = last7[0].day;
    const schema = getProgressSchemaSupport();

    try {
      let statsRes = await client
        .from(TABLES.userLearningStats)
        .select(statsSelectColumns())
        .eq("clerk_user_id", userId)
        .maybeSingle();

      if (statsRes.error) {
        applyStatsSchemaError(statsRes.error);
        if (statsRes.error.code === "42703") {
          statsRes = await client
            .from(TABLES.userLearningStats)
            .select("xp_today, daily_goal, streak, total_xp")
            .eq("clerk_user_id", userId)
            .maybeSingle();
        }
      }

      const completionsRes = await client
        .from(TABLES.lessonCompletions)
        .select("lesson_id")
        .eq("clerk_user_id", userId);

      let xpDailyRes: {
        data: { day: string; xp: number }[] | null;
        error: PostgrestError | null;
      } = { data: [], error: null };
      if (schema.xpDaily) {
        xpDailyRes = await client
          .from(TABLES.xpDaily)
          .select("day, xp")
          .eq("clerk_user_id", userId)
          .gte("day", fromDay)
          .lte("day", today);
        if (xpDailyRes.error) {
          applyTableSchemaError(xpDailyRes.error, "xpDaily");
          xpDailyRes = { data: [], error: null };
        } else {
          markProgressSchemaSupport({ xpDaily: true });
        }
      }

      let achievementsRes: {
        data: { achievement_id: string; unlocked_at: string }[] | null;
        error: PostgrestError | null;
      } = { data: [], error: null };
      if (schema.achievements) {
        achievementsRes = await client
          .from(TABLES.userAchievements)
          .select("achievement_id, unlocked_at")
          .eq("clerk_user_id", userId)
          .order("unlocked_at", { ascending: true });
        if (achievementsRes.error) {
          applyTableSchemaError(achievementsRes.error, "achievements");
          achievementsRes = { data: [], error: null };
        } else {
          markProgressSchemaSupport({ achievements: true });
        }
      }

      if (statsRes.error) throw statsRes.error;
      if (completionsRes.error) throw completionsRes.error;

      if (!statsRes.error && statsRes.data) {
        markProgressSchemaSupport({
          lastActivityDate: "last_activity_date" in statsRes.data,
        });
      }

      const stats = statsRes.data as {
        xp_today?: number;
        daily_goal?: number;
        streak?: number;
        total_xp?: number;
        last_activity_date?: string | null;
      } | null;
      const completions = (completionsRes.data ?? []).map((r) => r.lesson_id);
      const xpByDay = new Map(
        (xpDailyRes.data ?? []).map((r) => [r.day as string, r.xp as number])
      );

      const todayXp = xpByDay.get(today) ?? stats?.xp_today ?? 0;
      const total = stats?.total_xp ?? 0;
      const goal = stats?.daily_goal ?? 20;
      const currentStreak = stats?.streak ?? 0;

      setXpToday(todayXp);
      setDailyGoal(goal);
      setStreak(currentStreak);
      setTotalXp(total);
      setCompletedLessonIds(completions);

      const chartDays = last7.map((d) => ({
        day: d.day,
        label: d.label,
        xp: xpByDay.get(d.day) ?? (d.day === today ? todayXp : 0),
      }));
      setWeekXp(chartDays);
      setLeague(getLeagueFromTotalXp(total));

      const achievementRows = achievementsRes.data ?? [];
      setUnlockedAchievements(
        achievementRows
          .map((row) => {
            const def = ACHIEVEMENTS.find((a) => a.id === row.achievement_id);
            if (!def) return null;
            return {
              id: row.achievement_id,
              unlockedAt: row.unlocked_at,
              definition: def,
            };
          })
          .filter((a): a is UnlockedAchievement => Boolean(a))
      );

      loadedUserRef.current = userId;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load progress");
      console.warn("[useLearningProgress]", e);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, userId]);

  useEffect(() => {
    refresh();
  }, [refresh, supabase]);

  const persistStats = useCallback(
    async (
      client: SupabaseClient,
      uid: string,
      patch: {
        xpToday: number;
        totalXp: number;
        streak: number;
        lastActivityDate: string;
        dailyGoal: number;
      }
    ) => {
      const row: Record<string, unknown> = {
        clerk_user_id: uid,
        xp_today: patch.xpToday,
        total_xp: patch.totalXp,
        streak: patch.streak,
        daily_goal: patch.dailyGoal,
        updated_at: new Date().toISOString(),
      };
      if (getProgressSchemaSupport().lastActivityDate) {
        row.last_activity_date = patch.lastActivityDate;
      }

      const { error } = await client
        .from(TABLES.userLearningStats)
        .upsert(row, { onConflict: "clerk_user_id" });

      if (error) {
        applyStatsSchemaError(error);
        if (error.code === "42703") {
          delete row.last_activity_date;
          const retry = await client
            .from(TABLES.userLearningStats)
            .upsert(row, { onConflict: "clerk_user_id" });
          if (retry.error) throw retry.error;
          return;
        }
        throw error;
      }
      markProgressSchemaSupport({
        lastActivityDate: getProgressSchemaSupport().lastActivityDate || "last_activity_date" in row,
      });
    },
    []
  );

  const applyXp = useCallback(
    async (amount: number) => {
      if (!isSignedIn || !userId || amount <= 0) return;

      const client = supabaseRef.current;
      const today = toDateKey(new Date());

      if (!isSupabaseConfigured || !client) {
        const nextToday = Math.min(xpToday + amount, dailyGoal);
        const nextTotal = totalXp + amount;
        setXpToday(nextToday);
        setTotalXp(nextTotal);
        setLeague(getLeagueFromTotalXp(nextTotal));
        return;
      }

      let statsRowRes = await client
        .from(TABLES.userLearningStats)
        .select(statsSelectColumns())
        .eq("clerk_user_id", userId)
        .maybeSingle();

      if (statsRowRes.error?.code === "42703") {
        applyStatsSchemaError(statsRowRes.error);
        statsRowRes = await client
          .from(TABLES.userLearningStats)
          .select("streak, daily_goal, total_xp, xp_today")
          .eq("clerk_user_id", userId)
          .maybeSingle();
      }

      const statsRow = statsRowRes.data as {
        streak?: number;
        last_activity_date?: string | null;
        daily_goal?: number;
        total_xp?: number;
        xp_today?: number;
      } | null;

      const goal = statsRow?.daily_goal ?? dailyGoal;
      const lastDate =
        statsRow && "last_activity_date" in statsRow
          ? (statsRow.last_activity_date ?? null)
          : null;
      const nextStreak = calculateNextStreak(
        lastDate,
        statsRow?.streak ?? streak
      );
      const todayXp = await addDailyXp(
        client,
        userId,
        amount,
        today,
        statsRow?.xp_today ?? xpToday
      );
      const cappedToday = Math.min(todayXp, goal);
      const nextTotal = (statsRow?.total_xp ?? totalXp) + amount;

      await persistStats(client, userId, {
        xpToday: cappedToday,
        totalXp: nextTotal,
        streak: nextStreak,
        lastActivityDate: today,
        dailyGoal: goal,
      });

      await syncAchievements(
        client,
        userId,
        {
          streak: nextStreak,
          totalXp: nextTotal,
          completedLessonCount: completedLessonIds.length,
          xpToday: cappedToday,
          dailyGoal: goal,
        },
        unlockedAchievements.map((a) => a.id)
      );

      setXpToday(cappedToday);
      setTotalXp(nextTotal);
      setStreak(nextStreak);
      setLeague(getLeagueFromTotalXp(nextTotal));
      await refresh();
    },
    [
      completedLessonIds.length,
      dailyGoal,
      isSignedIn,
      persistStats,
      refresh,
      streak,
      totalXp,
      unlockedAchievements,
      userId,
      xpToday,
    ]
  );

  const recordLessonComplete = useCallback(
    async (lessonId: string, xpReward: number) => {
      if (!isSignedIn || !userId) return false;
      if (completedLessonIds.includes(lessonId)) return false;

      const client = supabaseRef.current;
      if (!isSupabaseConfigured || !client) {
        setCompletedLessonIds((prev) =>
          prev.includes(lessonId) ? prev : [...prev, lessonId]
        );
        await applyXp(xpReward);
        return true;
      }

      const { error: insertError } = await client
        .from(TABLES.lessonCompletions)
        .insert({ clerk_user_id: userId, lesson_id: lessonId });

      if (insertError) {
        if (insertError.code === "23505") {
          await refresh();
          return false;
        }
        throw insertError;
      }

      const nextCompleted = [...completedLessonIds, lessonId];
      setCompletedLessonIds(nextCompleted);
      await applyXp(xpReward);

      const { data: statsRow } = await client
        .from(TABLES.userLearningStats)
        .select("xp_today, total_xp, streak, daily_goal")
        .eq("clerk_user_id", userId)
        .maybeSingle();

      await syncAchievements(
        client,
        userId,
        {
          streak: statsRow?.streak ?? streak,
          totalXp: statsRow?.total_xp ?? totalXp,
          completedLessonCount: nextCompleted.length,
          xpToday: statsRow?.xp_today ?? xpToday,
          dailyGoal: statsRow?.daily_goal ?? dailyGoal,
        },
        unlockedAchievements.map((a) => a.id)
      );

      await refresh();
      return true;
    },
    [
      applyXp,
      completedLessonIds,
      dailyGoal,
      isSignedIn,
      refresh,
      streak,
      totalXp,
      unlockedAchievements,
      userId,
      xpToday,
    ]
  );

  const weekXpTotal = weekXp.reduce((sum, d) => sum + d.xp, 0);

  return {
    xpToday,
    dailyGoal,
    streak,
    totalXp,
    completedLessonIds,
    weekXp,
    weekXpTotal,
    league,
    unlockedAchievements,
    allAchievements: ACHIEVEMENTS,
    loading,
    error,
    refresh,
    addXP: applyXp,
    recordLessonComplete,
  };
}
