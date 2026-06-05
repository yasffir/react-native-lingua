import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AiTeacherLessonPicker } from "@/components/ai-teacher/AiTeacherLessonPicker";
import { images } from "@/constants/images";
import { colors, fontFamily } from "@/constants/theme";
import { useCurriculum } from "@/hooks/useCurriculum";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { getAiTeacherLesson } from "@/lib/curriculum/getAiTeacherLesson";
import { isLessonUnlocked } from "@/lib/curriculum/isLessonUnlocked";
import { openAiTeacherSession } from "@/lib/navigation/openAiTeacher";
import { posthog } from "@/lib/posthog";
import { useLanguageStore } from "@/store/languageStore";

export default function AITeacherScreen() {
  const router = useRouter();
  const { selectedLanguage } = useLanguageStore();
  const { completedLessonIds, refresh: refreshProgress } =
    useLearningProgress();
  const { units, allLessons, loading } = useCurriculum(selectedLanguage);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(
    null
  );

  const recommendedLesson = useMemo(
    () => getAiTeacherLesson(allLessons, completedLessonIds),
    [allLessons, completedLessonIds]
  );

  const selectedLesson = useMemo(
    () =>
      allLessons.find((lesson) => lesson.id === selectedLessonId) ??
      recommendedLesson,
    [allLessons, recommendedLesson, selectedLessonId]
  );

  useEffect(() => {
    if (!recommendedLesson) return;

    setSelectedLessonId((current) => {
      const currentLesson = current
        ? allLessons.find((lesson) => lesson.id === current)
        : null;

      if (
        currentLesson &&
        isLessonUnlocked(currentLesson, allLessons, completedLessonIds)
      ) {
        return current;
      }

      return recommendedLesson.id;
    });
  }, [allLessons, completedLessonIds, recommendedLesson?.id]);

  useFocusEffect(
    useCallback(() => {
      refreshProgress();
      posthog.capture("ai_teacher_viewed", {
        language_code: selectedLanguage,
        lesson_id: selectedLesson?.id ?? null,
        recommended_lesson_id: recommendedLesson?.id ?? null,
      });
    }, [
      recommendedLesson?.id,
      refreshProgress,
      selectedLanguage,
      selectedLesson?.id,
    ])
  );

  function handleSelectLesson(lessonId: string) {
    const lesson = allLessons.find((item) => item.id === lessonId);
    if (
      !lesson ||
      !isLessonUnlocked(lesson, allLessons, completedLessonIds)
    ) {
      return;
    }

    setSelectedLessonId(lessonId);
    posthog.capture("ai_teacher_lesson_selected", {
      language_code: selectedLanguage,
      lesson_id: lessonId,
      is_recommended: lessonId === recommendedLesson?.id,
    });
  }

  function handleStartPractice() {
    if (!selectedLanguage) {
      router.push("/language-select");
      return;
    }

    if (!selectedLesson) {
      router.push("/(tabs)/learn");
      return;
    }

    posthog.capture("ai_teacher_launch_tapped", {
      language_code: selectedLanguage,
      lesson_id: selectedLesson.id,
      source: "ai_teacher_tab",
      is_recommended: selectedLesson.id === recommendedLesson?.id,
    });

    openAiTeacherSession(router, selectedLesson);
  }

  if (!selectedLanguage) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>Pick a language first</Text>
          <Text style={styles.emptyBody}>
            Choose Luxembourgish on the home screen to practice with Luna.
          </Text>
          <TouchableOpacity
            style={styles.primaryButton}
            activeOpacity={0.85}
            onPress={() => router.push("/language-select")}
          >
            <Text style={styles.primaryButtonText}>Choose language</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (loading && allLessons.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary.purple} />
        </View>
      </SafeAreaView>
    );
  }

  const isRecommended =
    selectedLesson?.id != null &&
    selectedLesson.id === recommendedLesson?.id;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>AI Teacher</Text>
        <Text style={styles.title}>Talk with Luna</Text>
        <Text style={styles.subtitle}>
          Luna coaches in English · LOD plays native Luxembourgish
          pronunciation.
        </Text>

        <View style={styles.heroCard}>
          <Image
            source={images.mascotWelcome}
            style={styles.mascot}
            resizeMode="contain"
          />
          <View style={styles.lessonMeta}>
            <Text style={styles.lessonLabel}>
              {isRecommended ? "Recommended" : "Selected lesson"}
            </Text>
            <Text style={styles.lessonTitle} numberOfLines={2}>
              {selectedLesson?.title ?? "No lessons yet"}
            </Text>
            {selectedLesson ? (
              <Text style={styles.lessonHint}>
                {selectedLesson.vocabulary.length} words · Hold the mic to
                respond
              </Text>
            ) : null}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            !selectedLesson && styles.primaryButtonDisabled,
          ]}
          activeOpacity={0.85}
          testID="ai-teacher-start-button"
          onPress={handleStartPractice}
        >
          <Ionicons name="headset" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Start conversation</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <AiTeacherLessonPicker
          units={units}
          allLessons={allLessons}
          completedLessonIds={completedLessonIds}
          selectedLessonId={selectedLesson?.id ?? null}
          recommendedLessonId={recommendedLesson?.id ?? null}
          onSelect={handleSelectLesson}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.neutral.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral.border,
    backgroundColor: colors.neutral.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  eyebrow: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.primary.purple,
    marginBottom: 6,
  },
  title: {
    fontFamily: fontFamily.bold,
    fontSize: 28,
    color: colors.neutral.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.neutral.textSecondary,
    marginBottom: 20,
  },
  heroCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  mascot: {
    width: 88,
    height: 88,
  },
  lessonMeta: {
    flex: 1,
  },
  lessonLabel: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.neutral.textSecondary,
    marginBottom: 4,
  },
  lessonTitle: {
    fontFamily: fontFamily.semiBold,
    fontSize: 17,
    color: colors.neutral.textPrimary,
    marginBottom: 6,
  },
  lessonHint: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.neutral.textSecondary,
  },
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.primary.purple,
    borderRadius: 16,
    paddingVertical: 16,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: "#fff",
  },
  emptyTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.neutral.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyBody: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.neutral.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
});
