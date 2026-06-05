import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { colors, fontFamily } from "@/constants/theme";
import { playWord } from "@/lib/audio";
import type { CompleteChatExerciseStep } from "@/types/lessonExercise";

const DUO_BLUE = "#1CB0F6";
const DUO_BLUE_LIGHT = "#E8F4FC";
const DUO_BLUE_BORDER = "#84D8FF";
const DUO_GREEN_LIGHT = "#D7FFB8";
const DUO_GREEN_BORDER = "#58CC02";
const DUO_RED_LIGHT = "#FFDFE0";
const DUO_RED_BORDER = "#EE2A33";

interface CompleteChatStepViewProps {
  step: CompleteChatExerciseStep;
  selectedId: string | null;
  phase: "pick" | "wrong" | "correct";
  onSelect: (optionId: string) => void;
}

export function CompleteChatStepView({
  step,
  selectedId,
  phase,
  onSelect,
}: CompleteChatStepViewProps) {
  const disabled = phase === "correct" || phase === "wrong";
  const selectedOption = step.options.find((o) => o.id === selectedId);
  const correctOption = step.options.find((o) => o.id === step.correctOptionId);

  const promptTokens = step.prompt
    .replace(/([.,!?])/g, " $1 ")
    .split(/\s+/)
    .filter(Boolean);

  const replyPreview =
    phase === "correct"
      ? (correctOption?.text ?? "")
      : phase === "wrong"
        ? (selectedOption?.text ?? "")
        : "";

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Complete the chat</Text>

      <View style={styles.chatArea}>
        <View style={styles.promptRow}>
          <View style={styles.bubbleLeft}>
            {step.audioId ? (
              <TouchableOpacity
                style={styles.speaker}
                activeOpacity={0.8}
                onPress={() => playWord(step.audioId)}
              >
                <Ionicons name="volume-high" size={20} color={DUO_BLUE} />
              </TouchableOpacity>
            ) : null}
            <View style={styles.promptWords}>
              {promptTokens.map((token, i) => (
                <View key={`${token}-${i}`} style={styles.tokenWrap}>
                  <Text style={styles.promptToken}>{token}</Text>
                  {!/[.,!?]/.test(token) ? (
                    <View style={styles.tokenUnderline} />
                  ) : null}
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.replyRow}>
          <View
            style={[
              styles.bubbleRight,
              phase === "correct" && styles.bubbleRightCorrect,
              phase === "wrong" && styles.bubbleRightWrong,
            ]}
          >
            {replyPreview ? (
              <Text
                style={[
                  styles.replyText,
                  phase === "correct" && styles.replyTextCorrect,
                  phase === "wrong" && styles.replyTextWrong,
                ]}
              >
                {replyPreview}
              </Text>
            ) : (
              <View style={styles.replyPlaceholder} />
            )}
          </View>
        </View>
      </View>

      <View style={styles.options}>
        {step.options.map((option) => {
          const isSelected = selectedId === option.id;
          const isCorrect =
            phase === "correct" && option.id === step.correctOptionId;
          const isWrongPick =
            phase === "wrong" && isSelected && option.id !== step.correctOptionId;

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
                pressed && !disabled && styles.optionPressed,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  isSelected && phase === "pick" && styles.optionTextSelected,
                  isCorrect && styles.optionTextCorrect,
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
  chatArea: {
    marginBottom: 32,
  },
  promptRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  bubbleLeft: {
    flex: 1,
    maxWidth: "88%",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    padding: 14,
  },
  speaker: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8F7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  promptWords: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "flex-end",
  },
  tokenWrap: {
    alignItems: "center",
  },
  promptToken: {
    fontFamily: fontFamily.bold,
    fontSize: 17,
    color: colors.neutral.textPrimary,
  },
  tokenUnderline: {
    marginTop: 2,
    width: "100%",
    height: 2,
    borderRadius: 1,
    backgroundColor: "#D1D5DB",
  },
  replyRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  bubbleRight: {
    minWidth: 120,
    maxWidth: "75%",
    minHeight: 52,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    borderBottomRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 14,
    justifyContent: "center",
  },
  bubbleRightCorrect: {
    borderColor: DUO_GREEN_BORDER,
    backgroundColor: DUO_GREEN_LIGHT,
  },
  bubbleRightWrong: {
    borderColor: DUO_RED_BORDER,
    backgroundColor: DUO_RED_LIGHT,
  },
  replyPlaceholder: {
    width: 48,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
    alignSelf: "center",
  },
  replyText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.neutral.textPrimary,
  },
  replyTextCorrect: {
    fontFamily: fontFamily.bold,
    color: "#2B7A0B",
  },
  replyTextWrong: {
    fontFamily: fontFamily.bold,
    color: "#C81E26",
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
    fontSize: 17,
    color: colors.neutral.textPrimary,
  },
  optionTextSelected: {
    fontFamily: fontFamily.bold,
    color: "#1A7AB8",
  },
  optionTextCorrect: {
    color: "#2B7A0B",
    fontFamily: fontFamily.bold,
  },
  optionTextWrong: {
    color: "#C81E26",
    fontFamily: fontFamily.bold,
  },
});
