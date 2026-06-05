import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { UsagePhrasesSection } from "@/components/UsagePhrasesSection";
import { colors, fontFamily } from "@/constants/theme";
import type { UsagePhrase } from "@/lib/aiTeacher/buildUsagePhrases";
import type { VocabularyItem } from "@/types/learning";

export type VocabDrillPhase =
  | "loading"
  | "speak"
  | "checking"
  | "correct"
  | "retry"
  | "complete";

interface VocabDrillCardProps {
  item: VocabularyItem;
  index: number;
  total: number;
  phase: VocabDrillPhase;
  usagePhrases: UsagePhrase[];
  usageLoading?: boolean;
  lastHeard?: string;
  onReplay: () => void;
  onNext: () => void;
  onSkip: () => void;
}

export function VocabDrillCard({
  item,
  index,
  total,
  phase,
  usagePhrases,
  usageLoading,
  lastHeard,
  onReplay,
  onNext,
  onSkip,
}: VocabDrillCardProps) {
  const isComplete = phase === "complete";
  const showUsage =
    !isComplete && phase !== "loading" && phase !== "checking";

  return (
    <View style={styles.card}>
      <Text style={styles.progress}>
        {isComplete ? "Practice complete" : `Word ${index + 1} of ${total}`}
      </Text>

      {!isComplete ? (
        <>
          <View style={styles.wordRow}>
            {item.emoji ? (
              <Text style={styles.emoji}>{item.emoji}</Text>
            ) : null}
            <Text style={styles.luxWord}>{item.word}</Text>
            <TouchableOpacity
              hitSlop={10}
              onPress={onReplay}
              testID="vocab-drill-replay"
            >
              <Ionicons
                name="volume-high"
                size={24}
                color={colors.primary.purple}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.translation}>{item.translation}</Text>
          <Text style={styles.hint}>
            Listen to LOD · read the examples · then say the word
          </Text>

          {showUsage ? (
            <UsagePhrasesSection
              phrases={usagePhrases}
              loading={usageLoading}
              variant="inline"
            />
          ) : null}

          {phase === "loading" ? (
            <View style={styles.statusRow}>
              <ActivityIndicator size="small" color={colors.primary.purple} />
              <Text style={styles.statusText}>Playing native audio…</Text>
            </View>
          ) : null}

          {phase === "speak" ? (
            <Text style={styles.instruction}>
              Your turn — hold the mic and say:{" "}
              <Text style={styles.instructionWord}>{item.word}</Text>
            </Text>
          ) : null}

          {phase === "checking" ? (
            <View style={styles.statusRow}>
              <ActivityIndicator size="small" color={colors.primary.purple} />
              <Text style={styles.statusText}>Checking…</Text>
            </View>
          ) : null}

          {phase === "correct" ? (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackGood}>Nice! 🎉</Text>
              {lastHeard ? (
                <Text style={styles.feedbackHeard}>Heard: {lastHeard}</Text>
              ) : null}
              <TouchableOpacity style={styles.nextButton} onPress={onNext}>
                <Text style={styles.nextButtonText}>
                  {index + 1 >= total ? "Finish" : "Next word"}
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          {phase === "retry" ? (
            <View style={styles.feedbackBox}>
              <Text style={styles.feedbackRetry}>
                Almost — listen again, then try once more.
              </Text>
              {lastHeard ? (
                <Text style={styles.feedbackHeard}>Heard: {lastHeard}</Text>
              ) : null}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.secondaryBtn} onPress={onReplay}>
                  <Text style={styles.secondaryBtnText}>Listen again</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondaryBtn} onPress={onSkip}>
                  <Text style={styles.secondaryBtnText}>Skip</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
        </>
      ) : (
        <Text style={styles.completeText}>
          You practiced all {total} words with native LOD pronunciation.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  progress: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    color: colors.primary.purple,
    marginBottom: 10,
  },
  wordRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  emoji: {
    fontSize: 22,
  },
  luxWord: {
    flex: 1,
    fontFamily: fontFamily.bold,
    fontSize: 24,
    color: colors.neutral.textPrimary,
  },
  translation: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.neutral.textSecondary,
    marginBottom: 8,
  },
  hint: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.neutral.textSecondary,
    marginBottom: 10,
  },
  instruction: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.neutral.textPrimary,
  },
  instructionWord: {
    fontFamily: fontFamily.semiBold,
    color: colors.primary.purple,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  statusText: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.neutral.textSecondary,
  },
  feedbackBox: {
    marginTop: 8,
    gap: 8,
  },
  feedbackGood: {
    fontFamily: fontFamily.semiBold,
    fontSize: 16,
    color: colors.semantic.success,
  },
  feedbackRetry: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.neutral.textPrimary,
  },
  feedbackHeard: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.neutral.textSecondary,
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  nextButton: {
    alignSelf: "flex-start",
    backgroundColor: colors.primary.purple,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
  },
  nextButtonText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
    color: "#fff",
  },
  secondaryBtn: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  secondaryBtnText: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.primary.purple,
  },
  completeText: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.neutral.textPrimary,
  },
});
