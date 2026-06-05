import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { colors, fontFamily } from "@/constants/theme";
import type { UsagePhrase } from "@/lib/aiTeacher/buildUsagePhrases";
import { playAudioUri } from "@/lib/audio";

interface UsagePhrasesSectionProps {
  phrases: UsagePhrase[];
  loading?: boolean;
  title?: string;
  accentColor?: string;
  variant?: "card" | "inline";
}

export function UsagePhrasesSection({
  phrases,
  loading,
  title = "Usage in different situations",
  accentColor = colors.primary.purple,
  variant = "card",
}: UsagePhrasesSectionProps) {
  if (loading) {
    return (
      <View style={variant === "card" ? styles.card : styles.inlineBox}>
        <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
        <ActivityIndicator size="small" color={accentColor} />
      </View>
    );
  }

  if (phrases.length === 0) return null;

  const containerStyle = variant === "card" ? styles.card : styles.inlineBox;

  return (
    <View style={containerStyle}>
      <Text style={[styles.title, { color: accentColor }]}>{title}</Text>
      {phrases.map((phrase) => (
        <View
          key={`${phrase.scenario}-${phrase.luxembourgish}`}
          style={styles.item}
        >
          <View style={styles.header}>
            <Text style={styles.scenario}>{phrase.scenario}</Text>
            {phrase.audioAac ? (
              <TouchableOpacity
                hitSlop={8}
                onPress={() => void playAudioUri(phrase.audioAac!)}
              >
                <Ionicons name="volume-medium" size={18} color={accentColor} />
              </TouchableOpacity>
            ) : null}
          </View>
          <Text style={styles.lux}>{phrase.luxembourgish}</Text>
          {phrase.english ? (
            <Text style={styles.en}>{phrase.english}</Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.neutral.border,
    borderRadius: 16,
    padding: 18,
    backgroundColor: "#fff",
    marginBottom: 14,
    gap: 10,
  },
  inlineBox: {
    backgroundColor: "#F8F7FF",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    gap: 8,
  },
  title: {
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },
  item: {
    gap: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scenario: {
    fontFamily: fontFamily.medium,
    fontSize: 11,
    color: colors.neutral.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  lux: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 22,
    color: colors.neutral.textPrimary,
  },
  en: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    color: colors.neutral.textSecondary,
  },
});
