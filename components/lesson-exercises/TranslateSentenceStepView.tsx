import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { WordChip } from "@/components/lesson-exercises/WordChip";
import { images } from "@/constants/images";
import { colors, fontFamily } from "@/constants/theme";
import { getAnswerChipVariants } from "@/lib/lessonExercises/incorrectFeedback";
import type { TranslationExerciseStep } from "@/types/lessonExercise";

interface BankSlot {
  chipId: string;
  text: string;
}

interface TranslateSentenceStepViewProps {
  step: TranslationExerciseStep;
  answerIds: string[];
  phase: "pick" | "wrong" | "correct";
  onTapBank: (chipId: string) => void;
  onTapAnswer: (index: number) => void;
}

export function TranslateSentenceStepView({
  step,
  answerIds,
  phase,
  onTapBank,
  onTapAnswer,
}: TranslateSentenceStepViewProps) {
  const chipById = useMemo(
    () => new Map(step.bank.map((c) => [c.id, c])),
    [step.bank]
  );

  const bankSlots: BankSlot[] = useMemo(() => {
    const used = new Set(answerIds);
    return step.bank.map((chip) =>
      used.has(chip.id)
        ? { chipId: chip.id, text: "" }
        : { chipId: chip.id, text: chip.text }
    );
  }, [step.bank, answerIds]);

  const sourceTokens = step.sourceSentence
    .replace(/([.,!?])/g, " $1 ")
    .split(/\s+/)
    .filter(Boolean);

  const disabled = phase === "correct" || phase === "wrong";

  const answerVariants = getAnswerChipVariants(
    answerIds,
    step.correctWords,
    (chipId) => chipById.get(chipId)?.text ?? "",
    phase
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.instruction}>Translate this sentence</Text>

      <View style={styles.promptRow}>
        <Image
          source={images.mascotWelcome}
          style={styles.mascot}
          contentFit="contain"
        />
        <View style={styles.bubble}>
          <TouchableOpacity style={styles.speakerSmall} activeOpacity={0.8}>
            <Ionicons name="volume-high" size={20} color="#1CB0F6" />
          </TouchableOpacity>
          <View style={styles.sourceWords}>
            {sourceTokens.map((token, i) => (
              <View key={`${token}-${i}`} style={styles.sourceTokenWrap}>
                <Text style={styles.sourceToken}>{token}</Text>
                {!/[.,!?]/.test(token) ? (
                  <View style={styles.sourceUnderline} />
                ) : null}
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.answerArea}>
        <View style={[styles.answerLine, { top: 36 }]} />
        <View style={[styles.answerLine, { top: 72 }]} />
        <View style={styles.answerChips}>
          {answerIds.map((chipId, index) => {
            const chip = chipById.get(chipId);
            if (!chip) return null;
            return (
              <WordChip
                key={`${chipId}-${index}`}
                text={chip.text}
                variant={answerVariants[index] ?? "answer"}
                onPress={
                  disabled ? undefined : () => onTapAnswer(index)
                }
                disabled={disabled}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.bankArea}>
        <View style={styles.bankChips}>
          {bankSlots.map((slot) =>
            slot.text ? (
              <WordChip
                key={slot.chipId}
                text={slot.text}
                variant="bank"
                onPress={
                  disabled ? undefined : () => onTapBank(slot.chipId)
                }
                disabled={disabled}
              />
            ) : (
              <WordChip
                key={`ph-${slot.chipId}`}
                text={null}
                variant="placeholder"
              />
            )
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
  },
  instruction: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.neutral.textPrimary,
    marginBottom: 20,
  },
  promptRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 28,
  },
  mascot: {
    width: 72,
    height: 96,
  },
  bubble: {
    flex: 1,
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
  speakerSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#E8F7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  sourceWords: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    alignItems: "flex-end",
  },
  sourceTokenWrap: {
    alignItems: "center",
  },
  sourceToken: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: colors.neutral.textPrimary,
  },
  sourceUnderline: {
    marginTop: 2,
    width: "100%",
    height: 2,
    borderRadius: 1,
    backgroundColor: "#D1D5DB",
  },
  answerArea: {
    minHeight: 100,
    marginBottom: 28,
    position: "relative",
  },
  answerLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: "#E5E7EB",
  },
  answerChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 8,
    minHeight: 96,
  },
  bankArea: {
    paddingTop: 8,
  },
  bankChips: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
