import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { IncorrectAnswerFooter } from "@/components/lesson-exercises/IncorrectAnswerFooter";
import { fontFamily } from "@/constants/theme";
import type { IncorrectAnswerFeedback } from "@/types/lessonExercise";

const DUO_GREEN = "#58CC02";
const DUO_GREEN_DARK = "#46A302";
const DUO_GREEN_LIGHT = "#D7FFB8";

type Phase = "pick" | "wrong" | "correct";

interface LessonStepFooterProps {
  phase: Phase;
  checkEnabled: boolean;
  isLastStep: boolean;
  saving: boolean;
  successTitle?: string;
  showExplain?: boolean;
  incorrectFeedback?: IncorrectAnswerFeedback | null;
  onCheck: () => void;
  onContinue: () => void;
  onGotIt?: () => void;
  onExplain?: () => void;
  onExplainMistake?: () => void;
}

export function LessonStepFooter({
  phase,
  checkEnabled,
  isLastStep,
  saving,
  successTitle = "Nicely done!",
  showExplain = false,
  incorrectFeedback = null,
  onCheck,
  onContinue,
  onGotIt,
  onExplain,
  onExplainMistake,
}: LessonStepFooterProps) {
  const insets = useSafeAreaInsets();
  const footerBottomPad = Math.max(insets.bottom, 16);

  if (phase === "wrong" && incorrectFeedback && onGotIt) {
    return (
      <IncorrectAnswerFooter
        feedback={incorrectFeedback}
        onGotIt={onGotIt}
        onExplainMistake={onExplainMistake}
      />
    );
  }

  if (phase === "correct") {
    return (
      <View style={[styles.successFooter, { paddingBottom: footerBottomPad }]}>
        <View style={styles.successBanner}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={22} color="#fff" />
          </View>
          <Text style={styles.successText}>{successTitle}</Text>
        </View>
        {showExplain && onExplain ? (
          <Pressable
            style={({ pressed }) => [
              styles.explainButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onExplain}
          >
            <Text style={styles.explainButtonText}>EXPLAIN MY ANSWER</Text>
          </Pressable>
        ) : null}
        <Pressable
          style={({ pressed }) => [
            styles.continueButton,
            pressed && styles.buttonPressed,
            showExplain && styles.continueWithExplain,
          ]}
          onPress={onContinue}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.continueButtonText}>
              {isLastStep ? "FINISH" : "CONTINUE"}
            </Text>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.checkFooter, { paddingBottom: footerBottomPad }]}>
      <Pressable
        style={({ pressed }) => [
          styles.checkButton,
          checkEnabled ? styles.checkButtonActive : styles.checkButtonDisabled,
          pressed && checkEnabled && styles.buttonPressed,
        ]}
        onPress={onCheck}
        disabled={!checkEnabled}
      >
        <Text
          style={[
            styles.checkButtonText,
            checkEnabled && styles.checkButtonTextActive,
          ]}
        >
          CHECK
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  checkFooter: {
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  checkButton: {
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  checkButtonDisabled: {
    backgroundColor: "#E5E5E5",
  },
  checkButtonActive: {
    backgroundColor: DUO_GREEN,
  },
  checkButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    letterSpacing: 0.8,
    color: "#AFAFAF",
  },
  checkButtonTextActive: {
    color: "#fff",
  },
  successFooter: {
    borderTopWidth: 2,
    borderTopColor: DUO_GREEN,
    backgroundColor: DUO_GREEN_LIGHT,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  successIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DUO_GREEN,
    alignItems: "center",
    justifyContent: "center",
  },
  successText: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: DUO_GREEN_DARK,
  },
  explainButton: {
    borderWidth: 2,
    borderColor: DUO_GREEN,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  explainButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    letterSpacing: 0.5,
    color: DUO_GREEN_DARK,
  },
  continueButton: {
    backgroundColor: DUO_GREEN,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueWithExplain: {
    marginTop: 0,
  },
  continueButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    letterSpacing: 0.8,
    color: "#fff",
  },
  buttonPressed: {
    opacity: 0.88,
  },
});
