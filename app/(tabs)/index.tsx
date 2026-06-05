import { useAuth, useUser } from "@clerk/expo";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { WordOfTheDayCard } from "@/components/WordOfTheDayCard";
import { WordOfTheDayModal } from "@/components/WordOfTheDayModal";
import { images } from "@/constants/images";
import { colors } from "@/constants/theme";
import { useCurriculum } from "@/hooks/useCurriculum";
import { useWordOfTheDay } from "@/hooks/useWordOfTheDay";
import { useLanguages } from "@/hooks/useLanguages";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { getNextLesson } from "@/lib/curriculum/getNextLesson";
import { getAiTeacherLesson } from "@/lib/curriculum/getAiTeacherLesson";
import { openAiTeacherSession } from "@/lib/navigation/openAiTeacher";
import { posthog } from "@/lib/posthog";
import {
  useDailyPlanStore,
  type DailyPlanItemId,
} from "@/store/dailyPlanStore";
import { useLanguageStore } from "@/store/languageStore";
import type { Lesson } from "@/types/learning";

const DUO_BLUE = "#1CB0F6";

function getGreeting(): string {
  return "Moien";
}

const PLAN_ITEM_META: Record<
  DailyPlanItemId,
  {
    icon: "book" | "headset" | "chatbubble-ellipses";
    iconBg: string;
    iconColor: string;
    title: string;
  }
> = {
  lesson: {
    icon: "book",
    iconBg: "#EDE9FE",
    iconColor: colors.primary.purple,
    title: "Lesson",
  },
  "ai-conversation": {
    icon: "headset",
    iconBg: "#EDE9FE",
    iconColor: colors.primary.purple,
    title: "AI Conversation",
  },
  "new-words": {
    icon: "chatbubble-ellipses",
    iconBg: "#FEE2E2",
    iconColor: "#EF4444",
    title: "New words",
  },
};

interface TodayPlanItem {
  id: DailyPlanItemId;
  subtitle: string;
  completed: boolean;
  icon: "book" | "headset" | "chatbubble-ellipses";
  iconBg: string;
  iconColor: string;
  title: string;
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const { selectedLanguage } = useLanguageStore();
  const {
    completedLessonIds,
    xpToday,
    dailyGoal,
    streak,
    refresh: refreshProgress,
  } = useLearningProgress();

  const syncToday = useDailyPlanStore((s) => s.syncToday);
  const planCompleted = useDailyPlanStore((s) => s.completed);
  const planDateKey = useDailyPlanStore((s) => s.dateKey);
  const markPlanItemComplete = useDailyPlanStore((s) => s.markComplete);
  const [wordOfDayVisible, setWordOfDayVisible] = useState(false);
  const {
    word: wordOfDay,
    entry: wordOfDayEntry,
    loading: wordOfDayLoading,
  } = useWordOfTheDay();

  useFocusEffect(
    useCallback(() => {
      syncToday();
      refreshProgress();
    }, [refreshProgress, syncToday])
  );
  const { languages } = useLanguages();
  const { unit, allLessons } = useCurriculum(selectedLanguage);

  const nextLesson = useMemo(
    () => getNextLesson(allLessons, completedLessonIds),
    [allLessons, completedLessonIds]
  );

  const aiTeacherLesson = useMemo(
    () => getAiTeacherLesson(allLessons, completedLessonIds),
    [allLessons, completedLessonIds]
  );

  const planItems = useMemo((): TodayPlanItem[] => {
    const vocabCount = nextLesson?.vocabulary.length ?? 0;
    const lessonSubtitle = nextLesson?.title ?? "Start a lesson";
    const wordsSubtitle = wordOfDay?.lemma
      ? `LOD · ${wordOfDay.lemma}`
      : vocabCount > 0
        ? `${vocabCount} words`
        : "Review vocabulary";

    const isDone = (id: DailyPlanItemId) => Boolean(planCompleted[id]);

    return [
      {
        id: "lesson",
        ...PLAN_ITEM_META.lesson,
        subtitle: lessonSubtitle,
        completed: isDone("lesson") || xpToday > 0,
      },
      {
        id: "ai-conversation",
        ...PLAN_ITEM_META["ai-conversation"],
        subtitle: aiTeacherLesson
          ? `Practice · ${aiTeacherLesson.title}`
          : "Talk with Luna",
        completed: isDone("ai-conversation"),
      },
      {
        id: "new-words",
        ...PLAN_ITEM_META["new-words"],
        subtitle: wordsSubtitle,
        completed: isDone("new-words"),
      },
    ];
  }, [aiTeacherLesson, nextLesson, planCompleted, planDateKey, xpToday, wordOfDay?.lemma]);

  const language = languages.find((l) => l.code === selectedLanguage);
  const firstName = user?.firstName ?? "Learner";
  const greeting = getGreeting();
  const xpProgress =
    dailyGoal > 0 ? Math.min((xpToday / dailyGoal) * 100, 100) : 0;

  function handleContinueLearning() {
    posthog.capture("continue_learning_tapped", {
      language_code: selectedLanguage,
      unit_order: unit?.order ?? 1,
      xp_today: xpToday,
      streak,
    });

    if (!selectedLanguage) {
      router.push("/language-select");
      return;
    }

    if (nextLesson) {
      router.push(`/lesson/${nextLesson.id}`);
      return;
    }

    router.push("/(tabs)/learn");
  }

  function openNextLesson(lesson: Lesson | null) {
    if (!selectedLanguage) {
      router.push("/language-select");
      return;
    }
    if (lesson) {
      router.push(`/lesson/${lesson.id}`);
      return;
    }
    router.push("/(tabs)/learn");
  }

  function handlePlanItemPress(itemId: DailyPlanItemId) {
    posthog.capture("daily_plan_item_tapped", {
      item_id: itemId,
      language_code: selectedLanguage,
      lesson_id: nextLesson?.id ?? null,
    });

    if (itemId === "lesson") {
      openNextLesson(nextLesson);
      return;
    }
    if (itemId === "ai-conversation") {
      if (!selectedLanguage) {
        router.push("/language-select");
        return;
      }
      posthog.capture("ai_teacher_launch_tapped", {
        language_code: selectedLanguage,
        lesson_id: aiTeacherLesson?.id ?? null,
        source: "daily_plan",
      });
      if (openAiTeacherSession(router, aiTeacherLesson)) return;
      router.push("/(tabs)/learn");
      return;
    }
    markPlanItemComplete("new-words");
    setWordOfDayVisible(true);
  }

  function openWordOfTheDay() {
    posthog.capture("word_of_the_day_opened", {
      language_code: selectedLanguage,
      lod_id: wordOfDay?.lodId ?? null,
    });
    setWordOfDayVisible(true);
  }

  function handleViewAllPlan() {
    posthog.capture("daily_plan_view_all_tapped", {
      language_code: selectedLanguage,
    });
    router.push("/(tabs)/learn");
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.neutral.background }}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center gap-[10px]">
            {language ? (
              <Image
                source={{ uri: language.flag }}
                className="w-[34px] h-[34px] rounded-full"
              />
            ) : (
              <View className="w-[34px] h-[34px] rounded-full bg-surface" />
            )}
            <Text className="font-poppins-semibold text-base text-text-primary">
              {greeting}, {firstName}! 👋
            </Text>
          </View>

          <View className="flex-row items-center gap-[14px]">
            <View className="flex-row items-center gap-1">
              <Image source={images.streakFire} className="w-[22px] h-[22px]" />
              <Text className="font-poppins-semibold text-[15px] text-streak">
                {streak}
              </Text>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <Ionicons
                name="notifications-outline"
                size={24}
                color={colors.neutral.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.7} onPress={() => signOut()}>
              <Ionicons
                name="log-out-outline"
                size={24}
                color={colors.neutral.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Daily Goal Card ── */}
        <View className="flex-row items-center bg-[#FFF5E8] rounded-[20px] py-4 pl-5 pr-3 mb-4">
          <View className="flex-1 pr-2">
            <Text className="font-poppins text-xs text-text-secondary mb-1">
              Daily goal
            </Text>
            <Text>
              <Text className="font-poppins-bold text-[28px] text-text-primary leading-[34px]">
                {xpToday}
              </Text>
              <Text className="font-poppins text-sm text-text-secondary leading-[34px]">
                {` / ${dailyGoal} XP`}
              </Text>
            </Text>
            <View className="h-2 bg-border rounded mt-[10px] overflow-hidden">
              <View
                className="h-2 bg-streak rounded"
                style={{ width: `${Math.round(xpProgress)}%` as `${number}%` }}
              />
            </View>
          </View>
          <Image
            source={images.treasure}
            className="w-20 h-20"
            resizeMode="contain"
          />
        </View>

        <WordOfTheDayCard
          word={wordOfDay}
          entry={wordOfDayEntry}
          loading={wordOfDayLoading}
          onPress={openWordOfTheDay}
        />

        <TouchableOpacity
          activeOpacity={0.85}
          className="flex-row items-center bg-white rounded-[20px] border border-border px-4 py-4 mb-4"
          onPress={() => {
            posthog.capture("dictionary_opened", { source: "home" });
            router.push("/dictionary");
          }}
          testID="home-dictionary-link"
        >
          <View className="w-11 h-11 rounded-2xl bg-[#E8F7FF] items-center justify-center mr-3">
            <Ionicons name="book-outline" size={22} color={DUO_BLUE} />
          </View>
          <View className="flex-1">
            <Text className="font-poppins-semibold text-sm text-text-primary">
              LOD Dictionary
            </Text>
            <Text className="font-poppins text-xs text-text-secondary mt-0.5">
              Search in English or Luxembourgish · GWS A1 words
            </Text>
          </View>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={colors.neutral.textSecondary}
          />
        </TouchableOpacity>

        {/* ── Continue Learning Card ── */}
        <View className="flex-row bg-lingua-purple rounded-[20px] h-[160px] mb-6 overflow-hidden">
          <View className="flex-1 py-5 pl-5 pr-2 justify-between">
            <View>
              <Text className="font-poppins text-[11px] text-white/75 mb-0.5">
                Continue learning
              </Text>
              <Text className="font-poppins-bold text-[22px] text-white leading-7">
                {language?.name ?? "Pick a language"}
              </Text>
              <Text className="font-poppins text-xs text-white/65 mt-0.5">
                A1 · Unit {unit?.order ?? 1}
              </Text>
            </View>
            <TouchableOpacity
              className="bg-white rounded-xl py-2 px-[22px] self-start"
              activeOpacity={0.85}
              testID="continue-learning-button"
              onPress={handleContinueLearning}
            >
              <Text className="font-poppins-semibold text-[13px] text-lingua-purple">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
          <Image
            source={images.palace}
            className="w-[130px] h-[160px]"
            resizeMode="cover"
          />
        </View>

        {/* ── Today's Plan Header ── */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="font-poppins-semibold text-[17px] text-text-primary">
            {"Today's plan"}
          </Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleViewAllPlan}
            testID="daily-plan-view-all"
          >
            <Text className="font-poppins-medium text-[13px] text-lingua-blue">
              View all
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Today's Plan Card ── */}
        <View
          className="bg-white rounded-[20px] border border-border mb-4 overflow-hidden"
          style={styles.planCardShadow}
        >
          {planItems.map((item, index) => (
            <View key={item.id}>
              {index > 0 && <View className="h-px bg-border mx-4" />}
              <TouchableOpacity
                className="flex-row items-center px-4 py-[14px]"
                activeOpacity={0.7}
                testID={`daily-plan-item-${item.id}`}
                onPress={() => handlePlanItemPress(item.id)}
              >
                <View
                  className="w-11 h-11 rounded-xl items-center justify-center"
                  style={{ backgroundColor: item.iconBg }}
                >
                  <Ionicons name={item.icon} size={20} color={item.iconColor} />
                </View>
                <View className="flex-1 ml-3">
                  <Text className="font-poppins-semibold text-sm text-text-primary mb-0.5">
                    {item.title}
                  </Text>
                  <Text className="font-poppins text-xs text-text-secondary">
                    {item.subtitle}
                  </Text>
                </View>
                {item.completed ? (
                  <View className="w-[26px] h-[26px] rounded-full bg-lingua-blue items-center justify-center">
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  </View>
                ) : (
                  <View className="w-[26px] h-[26px] rounded-full border-2 border-border" />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <WordOfTheDayModal
        visible={wordOfDayVisible}
        word={wordOfDay}
        entry={wordOfDayEntry}
        loading={wordOfDayLoading}
        onClose={() => setWordOfDayVisible(false)}
      />
    </SafeAreaView>
  );
}

// ScrollView.contentContainerStyle and shadow (iOS/Android) must stay in StyleSheet
const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 100,
  },
  planCardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
});
