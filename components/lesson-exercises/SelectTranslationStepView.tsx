import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { images } from "@/constants/images";
import { colors, fontFamily } from "@/constants/theme";
import type { SelectTranslationExerciseStep } from "@/types/lessonExercise";

const DUO_BLUE_LIGHT = "#E8F4FC";
const DUO_BLUE_BORDER = "#84D8FF";
const DUO_GREEN_LIGHT = "#D7FFB8";
const DUO_GREEN_BORDER = "#58CC02";
const DUO_RED_LIGHT = "#FFDFE0";
const DUO_RED_BORDER = "#EE2A33";

interface SelectTranslationStepViewProps {
  step: SelectTranslationExerciseStep;
  selectedId: string | null;
  phase: "pick" | "wrong" | "correct";
  onSelect: (optionId: string) => void;
}

export function SelectTranslationStepView({
  step,
  selectedId,
  phase,
  onSelect,
}: SelectTranslationStepViewProps) {
  const disabled = phase === "correct" || phase === "wrong";

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Select the correct translation</Text>

      <View style={styles.promptRow}>
        <Image
          source={images.mascotWelcome}
          style={styles.mascot}
          contentFit="contain"
        />
        <View style={styles.bubble}>
          <Text style={styles.englishPrompt}>{step.englishPrompt}</Text>
        </View>
      </View>

      <View style={styles.options}>
        {step.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrect =
            phase === "correct" && option.id === step.correctOptionId;
          const isWrongPick =
            phase === "wrong" &&
            isSelected &&
            option.id !== step.correctOptionId;
          const showCorrectHint =
            phase === "wrong" && option.id === step.correctOptionId;

          return (
            <Pressable
              key={option.id}
              onPress={() => onSelect(option.id)}
              disabled={disabled}
              style={({ pressed }) => [
                styles.optionButton,
                isSelected && phase === "pick" && styles.optionSelected,
                isCorrect && styles.optionCorrect,
                isWrongPick && styles.optionWrong,
                showCorrectHint && styles.optionCorrect,
                pressed && !disabled && styles.optionPressed,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && phase === "pick" && styles.optionTextSelected,
                  (isCorrect || showCorrectHint) && styles.optionTextCorrect,
                  isWrongPick && styles.optionTextWrong,
                ]}
              >
                {option.text}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  instruction: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.neutral.textPrimary,
    marginBottom: 24,
  },
  promptRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 32,
  },
  mascot: {
    width: 80,
    height: 110,
  },
  bubble: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    paddingVertical: 18,
    paddingHorizontal: 20,
    justifyContent: "center",
    minHeight: 72,
  },
  englishPrompt: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.neutral.textPrimary,
    textAlign: "center",
  },
  options: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderBottomWidth: 4,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 18,
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: DUO_BLUE_LIGHT,
    borderColor: DUO_BLUE_BORDER,
  },
  optionCorrect: {
    backgroundColor: DUO_GREEN_LIGHT,
    borderColor: DUO_GREEN_BORDER,
  },
  optionWrong: {
    backgroundColor: DUO_RED_LIGHT,
    borderColor: DUO_RED_BORDER,
  },
  optionPressed: {
    opacity: 0.92,
    transform: [{ translateY: 1 }],
  },
  optionText: {
    fontFamily: fontFamily.medium,
    fontSize: 18,
    color: colors.neutral.textPrimary,
  },
  optionTextSelected: {
    fontFamily: fontFamily.bold,
    color: "#1A7AB8",
  },
  optionTextCorrect: {
    fontFamily: fontFamily.bold,
    color: "#2B7A0B",
  },
  optionTextWrong: {
    fontFamily: fontFamily.bold,
    color: "#C81E26",
  },
});
