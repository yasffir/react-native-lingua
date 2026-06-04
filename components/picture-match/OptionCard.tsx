import { Pressable, StyleSheet, Text, View } from "react-native";

import { VocabIllustration } from "@/components/picture-match/VocabIllustration";
import { colors, fontFamily } from "@/constants/theme";
import type { PictureMatchOption } from "@/types/pictureMatch";

const DUO_GREEN_BG = "#D7FFB8";
const DUO_GREEN_BORDER = "#58CC02";

const DUO_RED_BG = "#FFDFE0";
const DUO_RED_BORDER = "#EE2A33";

interface OptionCardProps {
  option: PictureMatchOption;
  selected: boolean;
  showCorrect: boolean;
  showIncorrect?: boolean;
  showAsCorrectAnswer?: boolean;
  disabled: boolean;
  onPress: () => void;
}

export function OptionCard({
  option,
  selected,
  showCorrect,
  showIncorrect = false,
  showAsCorrectAnswer = false,
  disabled,
  onPress,
}: OptionCardProps) {
  const isCorrectHighlight = showCorrect && selected;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.card,
        selected && !showCorrect && !showIncorrect && styles.cardSelected,
        isCorrectHighlight && styles.cardCorrect,
        showIncorrect && selected && styles.cardIncorrect,
        showAsCorrectAnswer && styles.cardCorrect,
        pressed && !disabled && styles.cardPressed,
      ]}
    >
      <View style={styles.artArea}>
        <VocabIllustration
          type={option.illustration}
          emoji={option.emoji}
        />
      </View>
      <Text style={styles.label}>{option.label.toLowerCase()}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minHeight: 148,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.neutral.border,
    overflow: "hidden",
  },
  cardSelected: {
    borderColor: "#D1D5DB",
    backgroundColor: "#F9FAFB",
  },
  cardCorrect: {
    borderColor: DUO_GREEN_BORDER,
    backgroundColor: DUO_GREEN_BG,
  },
  cardIncorrect: {
    borderColor: DUO_RED_BORDER,
    backgroundColor: DUO_RED_BG,
  },
  cardPressed: {
    opacity: 0.92,
  },
  artArea: {
    flex: 1,
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  label: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    color: colors.neutral.textSecondary,
    textAlign: "center",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.neutral.border,
  },
});
