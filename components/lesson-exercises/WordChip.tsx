import { Pressable, StyleSheet, Text, View } from "react-native";

import { fontFamily } from "@/constants/theme";

const DUO_GREEN = "#58CC02";
const DUO_GREEN_LIGHT = "#D7FFB8";

export type WordChipVariant =
  | "bank"
  | "answer"
  | "answerCorrect"
  | "answerIncorrect"
  | "answerPartial"
  | "bankIncorrect"
  | "placeholder";

interface WordChipProps {
  text: string | null;
  variant: WordChipVariant;
  onPress?: () => void;
  disabled?: boolean;
}

export function WordChip({
  text,
  variant,
  onPress,
  disabled,
}: WordChipProps) {
  if (variant === "placeholder") {
    return <View style={styles.placeholder} />;
  }

  const isAnswer =
    variant === "answer" ||
    variant === "answerCorrect" ||
    variant === "answerIncorrect" ||
    variant === "answerPartial";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || !onPress}
      style={({ pressed }) => [
        styles.chip,
        isAnswer && styles.chipAnswer,
        variant === "answerCorrect" && styles.chipAnswerCorrect,
        variant === "answerIncorrect" && styles.chipAnswerIncorrect,
        variant === "answerPartial" && styles.chipAnswerPartial,
        variant === "bankIncorrect" && styles.chipBankIncorrect,
        pressed && onPress && styles.chipPressed,
      ]}
    >
      <Text
        style={[
          styles.chipText,
          isAnswer && styles.chipTextAnswer,
          variant === "answerCorrect" && styles.chipTextCorrect,
          (variant === "answerIncorrect" || variant === "bankIncorrect") &&
            styles.chipTextIncorrect,
        ]}
      >
        {text}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderBottomWidth: 4,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    marginBottom: 8,
  },
  chipAnswer: {
    backgroundColor: "#fff",
    borderColor: "#D1D5DB",
  },
  chipAnswerCorrect: {
    backgroundColor: DUO_GREEN_LIGHT,
    borderColor: DUO_GREEN,
  },
  chipAnswerIncorrect: {
    backgroundColor: "#FFDFE0",
    borderColor: "#EE2A33",
  },
  chipAnswerPartial: {
    backgroundColor: "#fff",
    borderColor: "#D1D5DB",
  },
  chipBankIncorrect: {
    backgroundColor: "#FFDFE0",
    borderColor: "#EE2A33",
  },
  chipTextIncorrect: {
    color: "#C81E26",
    fontFamily: fontFamily.bold,
  },
  chipPressed: {
    opacity: 0.85,
    transform: [{ translateY: 1 }],
  },
  chipText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: "#4B5563",
  },
  chipTextAnswer: {
    color: "#374151",
  },
  chipTextCorrect: {
    color: "#2B7A0B",
    fontFamily: fontFamily.bold,
  },
  placeholder: {
    width: 72,
    height: 44,
    backgroundColor: "#E5E5E5",
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 8,
    opacity: 0.5,
  },
});
