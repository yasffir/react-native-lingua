import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, fontFamily } from "@/constants/theme";
import type { MatchingPairsExerciseStep } from "@/types/lessonExercise";

const DUO_BLUE_LIGHT = "#E8F4FC";
const DUO_BLUE_BORDER = "#84D8FF";
const DUO_GREEN_LIGHT = "#D7FFB8";
const DUO_GREEN_BORDER = "#58CC02";
const DUO_RED_LIGHT = "#FFDFE0";
const DUO_RED_BORDER = "#EE2A33";

type SelectedTile = {
  side: "left" | "right";
  tileId: string;
  pairId: string;
};

interface MatchingPairsStepViewProps {
  step: MatchingPairsExerciseStep;
  phase: "pick" | "wrong" | "correct";
  onAllMatched: (complete: boolean) => void;
}

export function MatchingPairsStepView({
  step,
  phase,
  onAllMatched,
}: MatchingPairsStepViewProps) {
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [selected, setSelected] = useState<SelectedTile | null>(null);
  const [wrongPairIds, setWrongPairIds] = useState<string[]>([]);

  const disabled = phase === "correct" || phase === "wrong";
  const totalPairs = step.pairs.length;

  useEffect(() => {
    setMatchedPairIds([]);
    setSelected(null);
    setWrongPairIds([]);
    onAllMatched(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when step changes
  }, [step.id]);

  useEffect(() => {
    onAllMatched(matchedPairIds.length === totalPairs);
  }, [matchedPairIds.length, totalPairs, onAllMatched]);

  function isMatched(pairId: string) {
    return matchedPairIds.includes(pairId);
  }

  function handleTilePress(
    side: "left" | "right",
    tileId: string,
    pairId: string
  ) {
    if (disabled || isMatched(pairId)) return;

    if (!selected) {
      setSelected({ side, tileId, pairId });
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }

    if (selected.side === side) {
      if (selected.tileId === tileId) {
        setSelected(null);
      } else {
        setSelected({ side, tileId, pairId });
      }
      return;
    }

    if (selected.pairId === pairId) {
      setMatchedPairIds((prev) => [...prev, pairId]);
      setSelected(null);
      setWrongPairIds([]);
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      return;
    }

    setWrongPairIds([selected.pairId, pairId]);
    setSelected(null);
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    setTimeout(() => setWrongPairIds([]), 400);
  }

  function renderColumn(
    side: "left" | "right",
    tiles: MatchingPairsExerciseStep["leftTiles"]
  ) {
    return (
      <View style={styles.column}>
        {tiles.map((tile) => {
          const matched = isMatched(tile.pairId);
          const isSelected = selected?.tileId === tile.tileId;
          const isWrong = wrongPairIds.includes(tile.pairId);

          return (
            <Pressable
              key={tile.tileId}
              onPress={() => handleTilePress(side, tile.tileId, tile.pairId)}
              disabled={disabled || matched}
              style={({ pressed }) => [
                styles.tile,
                matched && styles.tileMatched,
                isSelected && styles.tileSelected,
                isWrong && styles.tileWrong,
                pressed && !disabled && !matched && styles.tilePressed,
              ]}
            >
              <Text
                style={[
                  styles.tileText,
                  matched && styles.tileTextMatched,
                  isSelected && styles.tileTextSelected,
                  isWrong && styles.tileTextWrong,
                ]}
                numberOfLines={2}
              >
                {tile.text}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>Tap the matching pairs</Text>
      <View style={styles.columns}>
        {renderColumn("left", step.leftTiles)}
        {renderColumn("right", step.rightTiles)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  instruction: {
    fontFamily: fontFamily.bold,
    fontSize: 22,
    color: colors.neutral.textPrimary,
    marginBottom: 20,
  },
  columns: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  column: {
    flex: 1,
    gap: 10,
  },
  tile: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderBottomWidth: 4,
    borderBottomColor: "#D1D5DB",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    minHeight: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  tilePressed: {
    opacity: 0.92,
  },
  tileSelected: {
    backgroundColor: DUO_BLUE_LIGHT,
    borderColor: DUO_BLUE_BORDER,
    borderBottomColor: DUO_BLUE_BORDER,
  },
  tileMatched: {
    backgroundColor: DUO_GREEN_LIGHT,
    borderColor: DUO_GREEN_BORDER,
    borderBottomColor: DUO_GREEN_BORDER,
    opacity: 0.85,
  },
  tileWrong: {
    backgroundColor: DUO_RED_LIGHT,
    borderColor: DUO_RED_BORDER,
    borderBottomColor: DUO_RED_BORDER,
  },
  tileText: {
    fontFamily: fontFamily.medium,
    fontSize: 16,
    color: colors.neutral.textPrimary,
    textAlign: "center",
  },
  tileTextSelected: {
    fontFamily: fontFamily.bold,
    color: "#1A7AB8",
  },
  tileTextMatched: {
    fontFamily: fontFamily.bold,
    color: "#2B7A0B",
  },
  tileTextWrong: {
    fontFamily: fontFamily.bold,
    color: "#C81E26",
  },
});
