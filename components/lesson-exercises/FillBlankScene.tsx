import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { images } from "@/constants/images";
import type { FillBlankVisual } from "@/types/lessonExercise";

const SCENES: Record<
  FillBlankVisual,
  { primary: string; secondary?: string; useMascot?: boolean }
> = {
  greeting: { primary: "👋", useMascot: true },
  cafe: { primary: "☕", secondary: "🍵" },
  introduction: { primary: "🙋", useMascot: true },
  numbers: { primary: "🔢", secondary: "5️⃣" },
  polite: { primary: "🙏", useMascot: true },
  person_cat: { primary: "👨", secondary: "🐱", useMascot: true },
};

interface FillBlankSceneProps {
  visual: FillBlankVisual;
}

/** Visual clue above the sentence (Duolingo-style scene). */
export function FillBlankScene({ visual }: FillBlankSceneProps) {
  const scene = SCENES[visual] ?? SCENES.greeting;

  return (
    <View style={styles.wrap}>
      <View style={styles.ground} />
      {scene.useMascot ? (
        <Image
          source={images.mascotWelcome}
          style={styles.mascot}
          contentFit="contain"
        />
      ) : null}
      <View style={styles.emojiRow}>
        <Text style={styles.emojiLarge}>{scene.primary}</Text>
        {scene.secondary ? (
          <Text style={[styles.emojiLarge, styles.emojiSecondary]}>
            {scene.secondary}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: "100%",
    height: 160,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20,
    position: "relative",
  },
  ground: {
    position: "absolute",
    bottom: 24,
    left: "10%",
    right: "10%",
    height: 4,
    backgroundColor: "#C4A574",
    borderRadius: 2,
  },
  mascot: {
    width: 100,
    height: 120,
    marginBottom: 8,
  },
  emojiRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    marginBottom: 28,
  },
  emojiLarge: {
    fontSize: 56,
  },
  emojiSecondary: {
    fontSize: 44,
    marginBottom: 4,
  },
});
