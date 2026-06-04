import { Pressable, StyleSheet, Text, View } from "react-native";

import { FillBlankScene } from "@/components/lesson-exercises/FillBlankScene";
import { colors, fontFamily } from "@/constants/theme";
import type { FillInBlankExerciseStep } from "@/types/lessonExercise";

const DUO_BLUE_LIGHT = "#E8F4FC";
const DUO_BLUE_BORDER = "#84D8FF";
const DUO_GREEN_LIGHT = "#D7FFB8";
const DUO_GREEN_BORDER = "#58CC02";
const DUO_RED_LIGHT = "#FFDFE0";
const DUO_RED_BORDER = "#EE2A33";

interface FillInBlankStepViewProps {
  step: FillInBlankExerciseStep;
  selectedId: string | null;
  phase: "pick" | "wrong" | "correct";
  onSelect: (optionId: string) => void;
}

export function FillInBlankStepView({
  step,
  selectedId,
  phase,
  onSelect,
}: FillInBlankStepViewProps) {
  const disabled = phase === "correct" || phase === "wrong";
  const selectedWord = step.options.find((o) => o.id === selectedId)?.text;
  const correctWord = step.options.find(
    (o) => o.id === step.correctOptionId
  )?.text;

  const blankDisplay =
    phase === "correct"
      ? correctWord
      : phase === "wrong"
        ? selectedWord
        : selectedWord;

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Fill in the blank</Text>

      <FillBlankScene visual={step.visual} />

      <View style={styles.sentenceWrap}>
        <Text style={styles.sentence}>
          {step.before ? (
            <Text style={styles.sentencePart}>{step.before}</Text>
          ) : null}
          <Text
            style={[
              styles.blank,
              blankDisplay && styles.blankFilled,
              phase === "correct" && styles.blankCorrect,
              phase === "wrong" && styles.blankWrong,
            ]}
          >
            {blankDisplay ?? "        "}
          </Text>
          <Text style={styles.sentencePart}>{step.after}</Text>
        </Text>
      </View>

      <View style={styles.bank}>
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
                styles.option,
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
    marginBottom: 16,
  },
  sentenceWrap: {
    marginBottom: 28,
    paddingHorizontal: 4,
  },
  sentence: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
  },
  sentencePart: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.neutral.textPrimary,
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
    borderStyle: "dashed",
    paddingBottom: 2,
  },
  blank: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: colors.neutral.textSecondary,
    minWidth: 72,
    textAlign: "center",
    borderBottomWidth: 3,
    borderBottomColor: "#D1D5DB",
    marginHorizontal: 4,
    paddingBottom: 2,
  },
  blankFilled: {
    color: colors.neutral.textPrimary,
    borderBottomColor: colors.neutral.textPrimary,
  },
  blankCorrect: {
    color: "#2B7A0B",
    borderBottomColor: DUO_GREEN_BORDER,
    backgroundColor: DUO_GREEN_LIGHT,
    borderRadius: 6,
    overflow: "hidden",
  },
  blankWrong: {
    color: "#C81E26",
    borderBottomColor: DUO_RED_BORDER,
    backgroundColor: DUO_RED_LIGHT,
    borderRadius: 6,
  },
  bank: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  option: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderBottomWidth: 4,
    borderBottomColor: "#D1D5DB",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 22,
    minWidth: "42%",
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
  },
  optionText: {
    fontFamily: fontFamily.medium,
    fontSize: 17,
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
