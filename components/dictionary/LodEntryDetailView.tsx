import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { UsagePhrasesSection } from "@/components/UsagePhrasesSection";
import { colors, fontFamily } from "@/constants/theme";
import {
  buildUsagePhrases,
  toVocabForUsage,
} from "@/lib/aiTeacher/buildUsagePhrases";
import { playWord } from "@/lib/audio";
import type { LodEntrySummary } from "@/lib/lod/types";

const DUO_BLUE = "#1CB0F6";

interface LodEntryDetailViewProps {
  lemma: string;
  lodId: string | null;
  entry: LodEntrySummary | null;
  loading: boolean;
}

export function LodEntryDetailView({
  lemma,
  lodId,
  entry,
  loading,
}: LodEntryDetailViewProps) {
  const usagePhrases = useMemo(() => {
    if (!lodId) return [];
    const translation =
      entry?.translations.en ?? entry?.translations.fr ?? "Explore this word";
    return buildUsagePhrases(
      toVocabForUsage(lemma, translation, lodId),
      entry
    );
  }, [entry, lemma, lodId]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color={colors.primary.purple}
        style={styles.loader}
      />
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <View style={styles.chipRow}>
        <View style={styles.chip}>
          <Text style={styles.chipText}>{lemma}</Text>
        </View>
        {lodId ? (
          <TouchableOpacity hitSlop={10} onPress={() => void playWord(lodId)}>
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
        {entry?.translations.pt ? (
          <Text style={styles.translationLine}>
            <Text style={styles.langLabel}>PT </Text>
            {entry.translations.pt}
          </Text>
        ) : null}
        {!entry?.translations.en &&
        !entry?.translations.fr &&
        !entry?.translations.de &&
        !entry?.translations.pt ? (
          <Text style={styles.emptyHint}>No translations loaded yet.</Text>
        ) : null}
      </View>

      {entry?.examples && entry.examples.length > 0 ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Examples</Text>
          {entry.examples.slice(0, 3).map((example) => (
            <Text key={example.text} style={styles.exampleLine}>
              {example.text}
            </Text>
          ))}
        </View>
      ) : null}

      <UsagePhrasesSection
        phrases={usagePhrases}
        loading={loading}
        accentColor={DUO_BLUE}
      />

      <Text style={styles.attribution}>
        Data from Lëtzebuerger Online Dictionnaire (LOD) · CC0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 24,
  },
  loader: {
    marginTop: 48,
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
  exampleLine: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
    color: colors.neutral.textPrimary,
    marginBottom: 8,
  },
  emptyHint: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.neutral.textSecondary,
  },
  attribution: {
    fontFamily: fontFamily.regular,
    fontSize: 11,
    color: colors.neutral.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
});
