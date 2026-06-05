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
import {
  buildUsagePhrases,
  toVocabForUsage,
} from "@/lib/aiTeacher/buildUsagePhrases";
import { playWord } from "@/lib/audio";
import type { LodEntrySummary, LodWordOfTheDay } from "@/lib/lod/types";

const DUO_BLUE = "#1CB0F6";

interface WordOfTheDayModalProps {
  visible: boolean;
  word: LodWordOfTheDay | null;
  entry: LodEntrySummary | null;
  loading: boolean;
  onClose: () => void;
}

function WordOfTheDayModalBody({
  word,
  entry,
  loading,
  onClose,
}: Omit<WordOfTheDayModalProps, "visible">) {
  const insets = useSafeAreaInsets();

  const usagePhrases = useMemo(() => {
    if (!word) return [];
    const translation =
      entry?.translations.en ?? entry?.translations.fr ?? "Explore this word";
    return buildUsagePhrases(
      toVocabForUsage(word.lemma, translation, word.lodId),
      entry
    );
  }, [entry, word]);

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
        <Text style={styles.headerTitle}>Word of the day</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={colors.primary.purple}
            style={styles.loader}
          />
        ) : (
          <>
            <View style={styles.chipRow}>
              <View style={styles.chip}>
                <Text style={styles.chipText}>{word?.lemma ?? "—"}</Text>
              </View>
              {word?.lodId ? (
                <TouchableOpacity
                  hitSlop={10}
                  onPress={() => void playWord(word.lodId)}
                >
                  <Ionicons name="volume-high" size={26} color={DUO_BLUE} />
                </TouchableOpacity>
              ) : null}
            </View>

            {entry?.ipa ? (
              <Text style={styles.ipa}>IPA: /{entry.ipa}/</Text>
            ) : null}
            {entry?.partOfSpeech ? (
              <Text style={styles.pos}>{entry.partOfSpeech}</Text>
            ) : null}

            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Translations</Text>
              {entry?.translations.en ? (
                <Text style={styles.translationLine}>
                  <Text style={styles.langLabel}>EN </Text>
                  {entry.translations.en}
                </Text>
              ) : null}
              {entry?.translations.fr ? (
                <Text style={styles.translationLine}>
                  <Text style={styles.langLabel}>FR </Text>
                  {entry.translations.fr}
                </Text>
              ) : null}
              {entry?.translations.de ? (
                <Text style={styles.translationLine}>
                  <Text style={styles.langLabel}>DE </Text>
                  {entry.translations.de}
                </Text>
              ) : null}
            </View>

            <UsagePhrasesSection
              phrases={usagePhrases}
              loading={loading}
              accentColor={DUO_BLUE}
            />
          </>
        )}
      </ScrollView>

      <Pressable
        style={({ pressed }) => [
          styles.continueButton,
          pressed && { opacity: 0.9 },
        ]}
        onPress={onClose}
      >
        <Text style={styles.continueText}>GOT IT</Text>
      </Pressable>
    </View>
  );
}

export function WordOfTheDayModal({
  visible,
  word,
  entry,
  loading,
  onClose,
}: WordOfTheDayModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent={false}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <WordOfTheDayModalBody
          word={word}
          entry={entry}
          loading={loading}
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
  loader: {
    marginTop: 40,
  },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  chip: {
    backgroundColor: "#E8F7FF",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#B8E6FF",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipText: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: DUO_BLUE,
  },
  ipa: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.neutral.textSecondary,
    marginBottom: 4,
  },
  pos: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    color: colors.neutral.textSecondary,
    marginBottom: 14,
  },
  card: {
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 16,
    padding: 18,
    backgroundColor: "#fff",
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    color: colors.neutral.textPrimary,
    marginBottom: 10,
  },
  translationLine: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.neutral.textPrimary,
    marginBottom: 6,
  },
  langLabel: {
    fontFamily: fontFamily.bold,
    color: DUO_BLUE,
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
