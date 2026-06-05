import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, fontFamily } from "@/constants/theme";
import {
  buildUsagePhrases,
  toVocabForUsage,
} from "@/lib/aiTeacher/buildUsagePhrases";
import type { LodEntrySummary, LodWordOfTheDay } from "@/lib/lod/types";
import { playWord } from "@/lib/audio";

interface WordOfTheDayCardProps {
  word: LodWordOfTheDay | null;
  entry: LodEntrySummary | null;
  loading: boolean;
  onPress: () => void;
}

export function WordOfTheDayCard({
  word,
  entry,
  loading,
  onPress,
}: WordOfTheDayCardProps) {
  const english = entry?.translations.en ?? "Tap to explore";
  const ipa = entry?.ipa;

  const previewPhrase = useMemo(() => {
    if (!word || loading) return null;
    const phrases = buildUsagePhrases(
      toVocabForUsage(word.lemma, english, word.lodId),
      entry
    );
    return phrases[0] ?? null;
  }, [word, entry, english, loading]);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
      testID="word-of-the-day-card"
    >
      <View style={styles.headerRow}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LOD · Word of the day</Text>
        </View>
        {word?.lodId ? (
          <TouchableOpacity
            hitSlop={10}
            onPress={() => void playWord(word.lodId)}
          >
            <Ionicons
              name="volume-high"
              size={22}
              color={colors.primary.purple}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {loading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary.purple}
          style={styles.loader}
        />
      ) : (
        <>
          <Text style={styles.lemma}>{word?.lemma ?? "—"}</Text>
          {ipa ? <Text style={styles.ipa}>/{ipa}/</Text> : null}
          <Text style={styles.translation} numberOfLines={2}>
            {english}
          </Text>
          {previewPhrase ? (
            <View style={styles.previewBox}>
              <Text style={styles.previewScenario}>{previewPhrase.scenario}</Text>
              <Text style={styles.previewLux} numberOfLines={2}>
                {previewPhrase.luxembourgish}
              </Text>
            </View>
          ) : null}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.neutral.border,
    padding: 16,
    marginBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "#EDE9FE",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: fontFamily.semiBold,
    fontSize: 11,
    color: colors.primary.purple,
  },
  loader: {
    marginVertical: 12,
    alignSelf: "flex-start",
  },
  lemma: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.neutral.textPrimary,
    marginBottom: 4,
  },
  ipa: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.neutral.textSecondary,
    marginBottom: 6,
  },
  translation: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.neutral.textSecondary,
  },
  previewBox: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
  previewScenario: {
    fontFamily: fontFamily.medium,
    fontSize: 10,
    color: colors.primary.purple,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  previewLux: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.neutral.textPrimary,
  },
});
