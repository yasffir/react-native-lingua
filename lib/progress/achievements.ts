import { ACHIEVEMENTS } from "@/data/achievements";

export interface ProgressSnapshot {
  streak: number;
  totalXp: number;
  completedLessonCount: number;
  xpToday: number;
  dailyGoal: number;
}

export function getNewlyUnlockedAchievementIds(
  snapshot: ProgressSnapshot,
  alreadyUnlocked: string[]
): string[] {
  const unlocked = new Set(alreadyUnlocked);
  const next: string[] = [];

  for (const def of ACHIEVEMENTS) {
    if (unlocked.has(def.id)) continue;
    if (isAchievementEarned(def.id, snapshot)) {
      next.push(def.id);
    }
  }

  return next;
}

function isAchievementEarned(id: string, s: ProgressSnapshot): boolean {
  switch (id) {
    case "first_lesson":
      return s.completedLessonCount >= 1;
    case "streak_3":
      return s.streak >= 3;
    case "streak_7":
      return s.streak >= 7;
    case "lessons_3":
      return s.completedLessonCount >= 3;
    case "lessons_5":
      return s.completedLessonCount >= 5;
    case "xp_50":
      return s.totalXp >= 50;
    case "xp_100":
      return s.totalXp >= 100;
    case "daily_goal":
      return s.dailyGoal > 0 && s.xpToday >= s.dailyGoal;
    default:
      return false;
  }
}
