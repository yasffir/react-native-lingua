import { LESSON_MATCHING_PAIRS } from "@/data/matchingPairs";
import { shuffle } from "@/lib/lessonExercises/shuffle";
import type { Lesson } from "@/types/learning";
import type {
  MatchingPairEntry,
  MatchingPairsExerciseStep,
  MatchingPairsTile,
  TranslationExplain,
} from "@/types/lessonExercise";

const MAX_STEPS = 1;

function buildTiles(
  pairs: MatchingPairEntry[],
  side: "english" | "luxembourgish"
): MatchingPairsTile[] {
  const tiles = pairs.map((pair) => ({
    tileId: `${pair.pairId}-${side}`,
    pairId: pair.pairId,
    text: side === "english" ? pair.english : pair.luxembourgish,
  }));
  return shuffle(tiles);
}

export function buildMatchingPairsSteps(
  lesson: Lesson
): MatchingPairsExerciseStep[] {
  const sets = LESSON_MATCHING_PAIRS[lesson.id] ?? [];
  return shuffle(sets)
    .slice(0, MAX_STEPS)
    .map((configs, index) => {
      const pairs: MatchingPairEntry[] = configs.map((config, i) => ({
        pairId: `pair-${i}`,
        english: config.english,
        luxembourgish: config.luxembourgish,
      }));

      const summary = pairs
        .map((p) => `${p.english} ↔ ${p.luxembourgish}`)
        .join(" · ");

      const explain: TranslationExplain = {
        highlightWord: pairs[0]?.luxembourgish ?? "",
        meaning: `Match each English word or phrase to its Luxembourgish partner. ${summary}`,
        examples: pairs.map((p) => `${p.english} → ${p.luxembourgish}`),
      };

      return {
        type: "matching_pairs" as const,
        id: `${lesson.id}-match-${index}`,
        pairs,
        leftTiles: buildTiles(pairs, "english"),
        rightTiles: buildTiles(pairs, "luxembourgish"),
        explain,
      };
    });
}
