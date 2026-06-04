import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fontFamily } from "@/constants/theme";
import type { IncorrectAnswerFeedback } from "@/types/lessonExercise";

const DUO_RED = "#EE2A33";
const DUO_RED_DARK = "#C81E26";
const DUO_PINK_BG = "#FFDFE0";

interface IncorrectAnswerFooterProps {
  feedback: IncorrectAnswerFeedback;
  onGotIt: () => void;
  onExplainMistake?: () => void;
}

export function IncorrectAnswerFooter({
  feedback,
  onGotIt,
  onExplainMistake,
}: IncorrectAnswerFooterProps) {
  const insets = useSafeAreaInsets();
  const footerBottomPad = Math.max(insets.bottom, 16);

  return (
    <View style={[styles.footer, { paddingBottom: footerBottomPad }]}>
      <View style={styles.banner}>
        <View style={styles.iconCircle}>
          <Ionicons name="close" size={22} color="#fff" />
        </View>
        <Text style={styles.incorrectTitle}>Incorrect</Text>
      </View>

      <Text style={styles.correctAnswer}>{feedback.correctAnswer}</Text>
      <Text style={styles.meaningLabel}>Meaning:</Text>
      <Text style={styles.meaningText}>{feedback.meaning}</Text>

      {onExplainMistake ? (
        <Pressable
          style={({ pressed }) => [
            styles.explainButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={onExplainMistake}
        >
          <Text style={styles.explainButtonText}>EXPLAIN MY MISTAKE</Text>
        </Pressable>
      ) : null}

      <Pressable
        style={({ pressed }) => [
          styles.gotItButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={onGotIt}
      >
        <Text style={styles.gotItButtonText}>GOT IT</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 2,
    borderTopColor: DUO_RED,
    backgroundColor: DUO_PINK_BG,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: DUO_RED,
    alignItems: "center",
    justifyContent: "center",
  },
  incorrectTitle: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    color: DUO_RED_DARK,
  },
  correctAnswer: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    color: DUO_RED,
    marginBottom: 10,
  },
  meaningLabel: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    color: DUO_RED_DARK,
    marginBottom: 4,
  },
  meaningText: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    color: DUO_RED,
    marginBottom: 14,
  },
  explainButton: {
    borderWidth: 2,
    borderColor: DUO_RED,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  explainButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 14,
    letterSpacing: 0.5,
    color: DUO_RED,
  },
  gotItButton: {
    backgroundColor: DUO_RED,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  gotItButtonText: {
    fontFamily: fontFamily.bold,
    fontSize: 15,
    letterSpacing: 0.8,
    color: "#fff",
  },
  buttonPressed: {
    opacity: 0.9,
  },
});
