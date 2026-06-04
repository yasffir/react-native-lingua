import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExplainAnswerModal } from "@/components/lesson-exercises/ExplainAnswerModal";
import { LessonStepFooter } from "@/components/lesson-exercises/LessonStepFooter";
import { LessonStepHeader } from "@/components/lesson-exercises/LessonStepHeader";
import { CompleteChatStepView } from "@/components/lesson-exercises/CompleteChatStepView";
import { PictureMatchStepView } from "@/components/lesson-exercises/PictureMatchStepView";
import { FlashcardSpeakStepView } from "@/components/lesson-exercises/FlashcardSpeakStepView";
import { SelectTranslationStepView } from "@/components/lesson-exercises/SelectTranslationStepView";
import { FillInBlankStepView } from "@/components/lesson-exercises/FillInBlankStepView";
import { MatchingPairsStepView } from "@/components/lesson-exercises/MatchingPairsStepView";
import { TranslateSentenceStepView } from "@/components/lesson-exercises/TranslateSentenceStepView";
import { colors, fontFamily } from "@/constants/theme";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { useLesson } from "@/hooks/useLesson";
import { buildLessonSteps } from "@/lib/lessonExercises/buildLessonSteps";
import { isTranslationCorrect } from "@/lib/lessonExercises/buildTranslationSteps";
import { getIncorrectFeedback } from "@/lib/lessonExercises/incorrectFeedback";
import { posthog } from "@/lib/posthog";
import type { LessonExerciseStep } from "@/types/lessonExercise";

type Phase = "pick" | "wrong" | "correct";

export default function LessonExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { lesson, lessonIndex, loading } = useLesson(id);
  const { recordLessonComplete } = useLearningProgress();

  const steps = useMemo(
    () => (lesson ? buildLessonSteps(lesson) : []),
    [lesson]
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("pick");
  const [saving, setSaving] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [answerIds, setAnswerIds] = useState<string[]>([]);
  const [explainVisible, setExplainVisible] = useState(false);
  const [matchingComplete, setMatchingComplete] = useState(false);

  const handleMatchingComplete = useCallback((complete: boolean) => {
    setMatchingComplete(complete);
  }, []);

  const step = steps[stepIndex];
  const progress =
    steps.length > 0
      ? (stepIndex + (phase === "correct" ? 1 : 0)) / steps.length
      : 0;

  useEffect(() => {
    if (!lesson) return;
    posthog.capture("lesson_started", {
      lesson_id: lesson.id,
      mode: "mixed_exercises",
      lesson_number: lessonIndex >= 0 ? lessonIndex + 1 : 1,
      step_count: steps.length,
    });
  }, [lesson?.id, lessonIndex, steps.length]);

  function resetStepState() {
    setSelectedId(null);
    setAnswerIds([]);
    setMatchingComplete(false);
    setPhase("pick");
    setExplainVisible(false);
  }

  function handleOptionSelect(optionId: string) {
    if (phase !== "pick") return;
    if (
      step?.type !== "picture_match" &&
      step?.type !== "complete_chat" &&
      step?.type !== "select_translation" &&
      step?.type !== "fill_in_blank"
    ) {
      return;
    }
    setSelectedId(optionId);
  }

  function handleTapBank(chipId: string) {
    if (phase !== "pick" || step?.type !== "translate") return;
    setAnswerIds((prev) => [...prev, chipId]);
  }

  function handleTapAnswer(index: number) {
    if (phase !== "pick" || step?.type !== "translate") return;
    setAnswerIds((prev) => prev.filter((_, i) => i !== index));
  }

  function handleFlashcardComplete() {
    setPhase("correct");
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }

  function handleCheck() {
    if (!step || phase !== "pick") return;
    if (step.type === "flashcard_speak") return;

    let correct = false;

    if (
      step.type === "picture_match" ||
      step.type === "complete_chat" ||
      step.type === "select_translation" ||
      step.type === "fill_in_blank"
    ) {
      if (!selectedId) return;
      correct = selectedId === step.correctOptionId;
    } else if (step.type === "matching_pairs") {
      if (!matchingComplete) return;
      correct = true;
    } else if (step.type === "translate") {
      const selected = answerIds.map(
        (chipId) => step.bank.find((c) => c.id === chipId)?.text ?? ""
      );
      if (selected.length !== step.correctWords.length) return;
      correct = isTranslationCorrect(selected, step.correctWords);
    } else {
      return;
    }

    if (correct) {
      setPhase("correct");
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setPhase("wrong");
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  function handleGotIt() {
    resetStepState();
  }

  function handleContinue() {
    if (!lesson) return;

    if (stepIndex < steps.length - 1) {
      setStepIndex((i) => i + 1);
      resetStepState();
      return;
    }

    setSaving(true);
    void (async () => {
      try {
        await recordLessonComplete(lesson.id, lesson.xpReward);
        posthog.capture("lesson_completed", {
          lesson_id: lesson.id,
          lesson_number: lessonIndex >= 0 ? lessonIndex + 1 : 1,
          xp_earned: lesson.xpReward,
          mode: "mixed_exercises",
        });
        router.back();
      } catch (e) {
        console.warn("[lesson] save failed", e);
        router.back();
      } finally {
        setSaving(false);
      }
    })();
  }

  const checkEnabled = useMemo(() => {
    if (!step || phase !== "pick") return false;
    if (
      step.type === "picture_match" ||
      step.type === "complete_chat" ||
      step.type === "select_translation" ||
      step.type === "fill_in_blank"
    ) {
      return Boolean(selectedId);
    }
    if (step.type === "matching_pairs") {
      return matchingComplete;
    }
    if (step.type === "translate") {
      return answerIds.length === step.correctWords.length;
    }
    return false;
  }, [step, phase, selectedId, answerIds, matchingComplete]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary.purple} />
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson || steps.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.errorText}>Lesson not available</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.linkText}>Go back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isTranslate = step.type === "translate";
  const isChat = step.type === "complete_chat";
  const isSelectTranslation = step.type === "select_translation";
  const isFlashcard = step.type === "flashcard_speak";
  const isFillBlank = step.type === "fill_in_blank";
  const isMatchingPairs = step.type === "matching_pairs";
  const incorrectFeedback =
    phase === "wrong" ? getIncorrectFeedback(step) : null;

  const explainPayload =
    step.type === "picture_match"
      ? {
          highlightWord: step.promptWord,
          meaning: `${step.promptWord} means ${step.promptTranslation} in English.`,
          examples: [`${step.promptWord}!`],
        }
      : step.explain;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <LessonStepHeader
        progress={progress}
        onClose={() => router.back()}
      />

      {step.type === "picture_match" ? (
        <PictureMatchStepView
          step={step}
          selectedId={selectedId}
          phase={phase}
          onSelect={handleOptionSelect}
        />
      ) : step.type === "complete_chat" ? (
        <CompleteChatStepView
          step={step}
          selectedId={selectedId}
          phase={phase}
          onSelect={handleOptionSelect}
        />
      ) : step.type === "select_translation" ? (
        <SelectTranslationStepView
          step={step}
          selectedId={selectedId}
          phase={phase}
          onSelect={handleOptionSelect}
        />
      ) : step.type === "flashcard_speak" ? (
        <FlashcardSpeakStepView
          step={step}
          onComplete={handleFlashcardComplete}
        />
      ) : step.type === "fill_in_blank" ? (
        <FillInBlankStepView
          step={step}
          selectedId={selectedId}
          phase={phase}
          onSelect={handleOptionSelect}
        />
      ) : step.type === "matching_pairs" ? (
        <MatchingPairsStepView
          step={step}
          phase={phase}
          onAllMatched={handleMatchingComplete}
        />
      ) : (
        <TranslateSentenceStepView
          step={step}
          answerIds={answerIds}
          phase={phase}
          onTapBank={handleTapBank}
          onTapAnswer={handleTapAnswer}
        />
      )}

      {(isFlashcard ? phase === "correct" : true) ? (
        <LessonStepFooter
          phase={phase}
          checkEnabled={checkEnabled}
          isLastStep={stepIndex >= steps.length - 1}
          saving={saving}
          successTitle={
            isTranslate ||
            isChat ||
            isSelectTranslation ||
            isFlashcard ||
            isFillBlank ||
            isMatchingPairs
              ? "Excellent!"
              : "Nicely done!"
          }
          showExplain={
            (isTranslate ||
              isChat ||
              isSelectTranslation ||
              isFlashcard ||
              isFillBlank ||
              isMatchingPairs) &&
            phase === "correct"
          }
          incorrectFeedback={incorrectFeedback}
          onCheck={handleCheck}
          onContinue={handleContinue}
          onGotIt={handleGotIt}
          onExplain={() => setExplainVisible(true)}
          onExplainMistake={() => setExplainVisible(true)}
        />
      ) : null}

      <ExplainAnswerModal
        visible={explainVisible}
        explain={explainPayload}
        onClose={() => setExplainVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.neutral.textSecondary,
    marginBottom: 12,
  },
  linkText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 15,
    color: colors.primary.purple,
  },
});
