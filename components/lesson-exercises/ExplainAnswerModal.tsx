import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  initialWindowMetrics,
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

import { colors, fontFamily } from "@/constants/theme";
import { UsagePhrasesSection } from "@/components/UsagePhrasesSection";
import { useLodEntry } from "@/hooks/useLodEntry";
import {
  buildUsagePhrases,
  toVocabForUsage,
} from "@/lib/aiTeacher/buildUsagePhrases";
import { playWord } from "@/lib/audio";
import type { TranslationExplain } from "@/types/lessonExercise";

const DUO_BLUE = "#1CB0F6";

interface ExplainAnswerModalProps {
  visible: boolean;
  explain: TranslationExplain;
  lodId?: string;
  onClose: () => void;
}

/** Modal content must live under SafeAreaProvider — RN Modal uses a separate window. */
function ExplainAnswerModalBody({
  explain,
  lodId,
  onClose,
}: Omit<ExplainAnswerModalProps, "visible">) {
  const insets = useSafeAreaInsets();
  const { entry, loading } = useLodEntry(lodId);

  const usagePhrases = useMemo(() => {
    const item = toVocabForUsage(
      explain.highlightWord,
      explain.meaning,
      lodId
    );
    return buildUsagePhrases(item, entry, undefined, explain.examples);
  }, [entry, explain.examples, explain.highlightWord, explain.meaning, lodId]);

  return (
    <View
      style={[
        styles.safe,
        {
          paddingTop: insets.top,
          paddingBottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} hitSlop={12}>
          <Ionicons
            name="chevron-back"
            size={28}
            color={colors.neutral.textSecondary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Explain My Answer</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.chipRow}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>{explain.highlightWord}</Text>
          </View>
          {lodId ? (
            <TouchableOpacity hitSlop={10} onPress={() => void playWord(lodId)}>
              <Ionicons name="volume-high" size={24} color={DUO_BLUE} />
            </TouchableOpacity>
          ) : null}
        </View>

        {entry?.ipa ? (
          <Text style={styles.ipa}>IPA: /{entry.ipa}/</Text>
        ) : null}

        <View style={styles.card}>
          <Text style={styles.meaning}>
            <Text style={styles.meaningHighlight}>{explain.highlightWord}</Text>{" "}
            {explain.meaning}
          </Text>
          {explain.examples.map((example) => (
            <Text key={example} style={styles.example}>
              • {example}
            </Text>
          ))}
          <View style={styles.feedbackRow}>
            <TouchableOpacity hitSlop={8}>
              <Ionicons
                name="thumbs-down-outline"
                size={22}
                color={colors.neutral.textSecondary}
              />
            </TouchableOpacity>
            <TouchableOpacity hitSlop={8}>
              <Ionicons
                name="thumbs-up-outline"
                size={22}
                color={colors.neutral.textSecondary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <UsagePhrasesSection
          phrases={usagePhrases}
          loading={loading}
          accentColor={DUO_BLUE}
        />
      </ScrollView>

      <Pressable
        style={({ pressed }) => [
          styles.continueButton,
          pressed && { opacity: 0.9 },
        ]}
        onPress={onClose}
      >
        <Text style={styles.continueText}>CONTINUE LESSON</Text>
      </Pressable>
    </View>
  );
}

export function ExplainAnswerModal({
  visible,
  explain,
  lodId,
  onClose,
}: ExplainAnswerModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={false}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <ExplainAnswerModalBody
          explain={explain}
          lodId={visible ? lodId : undefined}
          onClose={onClose}
        />
      </SafeAreaProvider>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: fontFamily.bold,
    fontSize: 17,
    color: colors.neutral.textPrimary,
  },
  headerSpacer: {
    width: 28,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  chip: {
    alignSelf: "flex-start",
    backgroundColor: "#E8F7FF",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B8E6FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: DUO_BLUE,
  },
  ipa: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.neutral.textSecondary,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 16,
    padding: 18,
    backgroundColor: "#fff",
    marginBottom: 14,
  },
  meaning: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.neutral.textPrimary,
    marginBottom: 14,
  },
  meaningHighlight: {
    fontFamily: fontFamily.bold,
    color: DUO_BLUE,
  },
  example: {
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.neutral.textPrimary,
    marginBottom: 6,
  },
  feedbackRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 16,
    marginTop: 12,
  },
  continueButton: {
    marginHorizontal: 16,
    marginTop: 8,
    backgroundColor: DUO_BLUE,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  continueText: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    letterSpacing: 0.6,
    color: "#fff",
  },
});
