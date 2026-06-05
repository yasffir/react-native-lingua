import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { colors, fontFamily } from "@/constants/theme";
import { playWord } from "@/lib/audio";
import type { FlashcardSpeakExerciseStep } from "@/types/lessonExercise";

const DUO_BLUE = "#1CB0F6";
const DUO_BLUE_DARK = "#0E8BC4";
const CARD_GOLD = "#C9A227";
const CARD_YELLOW_BG = "#FFF9E6";
const CARD_YELLOW_BORDER = "#FFE066";

const LISTEN_DURATION_MS = 2200;

type CardSide = "question" | "answer";

interface FlashcardSpeakStepViewProps {
  step: FlashcardSpeakExerciseStep;
  onComplete: () => void;
}

export function FlashcardSpeakStepView({
  step,
  onComplete,
}: FlashcardSpeakStepViewProps) {
  const [side, setSide] = useState<CardSide>("question");
  const [listening, setListening] = useState(false);
  const listenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flipProgress = useSharedValue(0);

  useEffect(() => {
    return () => {
      if (listenTimerRef.current) clearTimeout(listenTimerRef.current);
    };
  }, []);

  const cardFrontStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flipProgress.value, [0, 0.45, 0.5], [1, 1, 0]),
    transform: [
      {
        rotateY: `${interpolate(flipProgress.value, [0, 1], [0, 180])}deg`,
      },
    ],
  }));

  const cardBackStyle = useAnimatedStyle(() => ({
    opacity: interpolate(flipProgress.value, [0.5, 0.55, 1], [0, 1, 1]),
    transform: [
      {
        rotateY: `${interpolate(flipProgress.value, [0, 1], [180, 360])}deg`,
      },
    ],
  }));

  function flipTo(next: CardSide) {
    setSide(next);
    flipProgress.value = withTiming(next === "answer" ? 1 : 0, {
      duration: 280,
    });
  }

  function handleFlipPress() {
    if (listening) return;
    flipTo(side === "question" ? "answer" : "question");
  }

  function finishSpeaking() {
    if (listenTimerRef.current) {
      clearTimeout(listenTimerRef.current);
      listenTimerRef.current = null;
    }
    setListening(false);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onComplete();
  }

  function startListening() {
    if (side !== "answer" || listening) return;
    setListening(true);
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    listenTimerRef.current = setTimeout(() => {
      finishSpeaking();
    }, LISTEN_DURATION_MS);
  }

  function handleCantSpeak() {
    if (listenTimerRef.current) clearTimeout(listenTimerRef.current);
    setListening(false);
    onComplete();
  }

  const micEnabled = side === "answer" && !listening;

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Translate the words</Text>

      <View style={styles.deck}>
        {[2, 1, 0].map((layer) => (
          <View
            key={layer}
            style={[
              styles.deckLayer,
              { top: layer * 6, transform: [{ scale: 1 - layer * 0.02 }] },
            ]}
          />
        ))}

        <View style={styles.cardSlot}>
          <Animated.View
            style={[styles.card, styles.cardQuestion, cardFrontStyle]}
          >
            <Text style={styles.luxWord}>{step.luxembourgishWord}</Text>
            {step.audioId ? (
              <TouchableOpacity
                style={styles.cardSpeaker}
                activeOpacity={0.8}
                onPress={() => playWord(step.audioId)}
              >
                <Ionicons name="volume-high" size={20} color="#1CB0F6" />
              </TouchableOpacity>
            ) : null}
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              styles.cardAnswer,
              styles.cardBack,
              cardBackStyle,
            ]}
          >
            <Text style={styles.enWord}>{step.englishWord}</Text>
          </Animated.View>
        </View>
      </View>

      <View style={styles.controls}>
        <Pressable
          onPress={startListening}
          disabled={side === "question" || listening}
          style={({ pressed }) => [
            styles.micButton,
            side === "question" && styles.micButtonDisabled,
            micEnabled && styles.micButtonActive,
            listening && styles.micButtonListening,
            pressed && micEnabled && styles.buttonPressed,
          ]}
        >
          {listening ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons
              name="mic"
              size={28}
              color={side === "answer" ? "#fff" : "#AFAFAF"}
            />
          )}
        </Pressable>

        <Pressable
          onPress={handleFlipPress}
          disabled={listening}
          style={({ pressed }) => [
            styles.flipButton,
            pressed && !listening && styles.buttonPressed,
          ]}
        >
          <Ionicons
            name="refresh"
            size={26}
            color={listening ? "#D1D5DB" : DUO_BLUE}
          />
        </Pressable>
      </View>

      {listening ? (
        <Text style={styles.listeningHint}>Listening… say the word aloud</Text>
      ) : side === "answer" ? (
        <Text style={styles.hint}>Tap the mic and say {step.luxembourgishWord}</Text>
      ) : (
        <Text style={styles.hint}>Flip the card to see the meaning</Text>
      )}

      <TouchableOpacity
        onPress={handleCantSpeak}
        disabled={listening}
        activeOpacity={0.7}
        style={styles.skipButton}
      >
        <Text style={styles.skipText}>CAN&apos;T SPEAK NOW</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    alignItems: "center",
  },
  instruction: {
    alignSelf: "flex-start",
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.neutral.textPrimary,
    marginBottom: 28,
  },
  deck: {
    width: "100%",
    maxWidth: 320,
    height: 220,
    marginBottom: 32,
    alignItems: "center",
  },
  deckLayer: {
    position: "absolute",
    width: "88%",
    height: 200,
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  cardSlot: {
    width: "92%",
    height: 200,
    perspective: 900,
  },
  card: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    backfaceVisibility: "hidden",
  },
  cardBack: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  cardQuestion: {
    backgroundColor: CARD_YELLOW_BG,
    borderColor: CARD_YELLOW_BORDER,
  },
  cardAnswer: {
    backgroundColor: "#fff",
    borderColor: "#E5E7EB",
  },
  cardSpeaker: {
    position: "absolute",
    bottom: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F7FF",
    alignItems: "center",
    justifyContent: "center",
  },
  luxWord: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    color: CARD_GOLD,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  enWord: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    color: colors.neutral.textPrimary,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
    maxWidth: 320,
    marginBottom: 12,
  },
  micButton: {
    flex: 1,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#E5E5E5",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    borderBottomColor: "#D1D5DB",
  },
  micButtonDisabled: {
    backgroundColor: "#E5E5E5",
    borderBottomColor: "#D1D5DB",
  },
  micButtonActive: {
    backgroundColor: DUO_BLUE,
    borderBottomColor: DUO_BLUE_DARK,
  },
  micButtonListening: {
    backgroundColor: DUO_BLUE_DARK,
    borderBottomColor: "#0A6E9A",
  },
  flipButton: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderBottomWidth: 4,
    borderBottomColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ translateY: 2 }],
  },
  listeningHint: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    color: DUO_BLUE,
    marginBottom: 20,
  },
  hint: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.neutral.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  skipText: {
    fontFamily: fontFamily.bold,
    fontSize: 13,
    letterSpacing: 0.6,
    color: "#C4C4C4",
  },
});
