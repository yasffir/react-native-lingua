import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { OptionCard } from "@/components/picture-match/OptionCard";
import { colors, fontFamily } from "@/constants/theme";
import type { PictureMatchExerciseStep } from "@/types/lessonExercise";

interface PictureMatchStepViewProps {
  step: PictureMatchExerciseStep;
  selectedId: string | null;
  phase: "pick" | "wrong" | "correct";
  onSelect: (optionId: string) => void;
}

export function PictureMatchStepView({
  step,
  selectedId,
  phase,
  onSelect,
}: PictureMatchStepViewProps) {
  const disabled = phase === "correct" || phase === "wrong";

  return (
    <>
      <View style={styles.promptSection}>
        <View style={styles.newWordRow}>
          <Ionicons name="sparkles" size={18} color={colors.primary.purple} />
          <Text style={styles.newWordLabel}>NEW WORD</Text>
        </View>
        <Text style={styles.instruction}>Select the correct image</Text>
        <View style={styles.wordRow}>
          <TouchableOpacity style={styles.speakerButton} activeOpacity={0.8}>
            <Ionicons name="volume-high" size={22} color="#1CB0F6" />
          </TouchableOpacity>
          <View>
            <Text style={styles.promptWord}>{step.promptWord}</Text>
            <View style={styles.promptUnderline} />
          </View>
        </View>
      </View>

      <View style={styles.grid}>
        <View style={styles.gridRow}>
          <OptionCard
            option={step.options[0]}
            selected={selectedId === step.options[0].id}
            showCorrect={phase === "correct"}
            showIncorrect={phase === "wrong"}
            showAsCorrectAnswer={
              phase === "wrong" &&
              step.options[0].id === step.correctOptionId
            }
            disabled={disabled}
            onPress={() => onSelect(step.options[0].id)}
          />
          <View style={styles.gridGap} />
          <OptionCard
            option={step.options[1]}
            selected={selectedId === step.options[1].id}
            showCorrect={phase === "correct"}
            showIncorrect={phase === "wrong"}
            showAsCorrectAnswer={
              phase === "wrong" &&
              step.options[1].id === step.correctOptionId
            }
            disabled={disabled}
            onPress={() => onSelect(step.options[1].id)}
          />
        </View>
        <View style={styles.gridRowGap} />
        <View style={styles.gridRow}>
          <OptionCard
            option={step.options[2]}
            selected={selectedId === step.options[2].id}
            showCorrect={phase === "correct"}
            showIncorrect={phase === "wrong"}
            showAsCorrectAnswer={
              phase === "wrong" &&
              step.options[2].id === step.correctOptionId
            }
            disabled={disabled}
            onPress={() => onSelect(step.options[2].id)}
          />
          <View style={styles.gridGap} />
          <OptionCard
            option={step.options[3]}
            selected={selectedId === step.options[3].id}
            showCorrect={phase === "correct"}
            showIncorrect={phase === "wrong"}
            showAsCorrectAnswer={
              phase === "wrong" &&
              step.options[3].id === step.correctOptionId
            }
            disabled={disabled}
            onPress={() => onSelect(step.options[3].id)}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  promptSection: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  newWordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  newWordLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    color: colors.primary.purple,
    letterSpacing: 0.5,
  },
  instruction: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.neutral.textPrimary,
    marginBottom: 16,
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  speakerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E8F7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  promptWord: {
    fontFamily: fontFamily.bold,
    fontSize: 26,
    color: colors.primary.purple,
  },
  promptUnderline: {
    marginTop: 4,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#C4B5FD",
    opacity: 0.7,
  },
  grid: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  gridRow: {
    flex: 1,
    flexDirection: "row",
  },
  gridGap: {
    width: 12,
  },
  gridRowGap: {
    height: 12,
  },
});
