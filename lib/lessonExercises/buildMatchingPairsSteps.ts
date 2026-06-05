import { LESSON_MATCHING_PAIRS } from "@/data/matchingPairs";
import { translationLanguageName } from "@/lib/translation";
import { shuffle } from "@/lib/lessonExercises/shuffle";
import type { Lesson, TranslationLanguage } from "@/types/learning";
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
  lesson: Lesson,
  translationLang: TranslationLanguage = "en"
): MatchingPairsExerciseStep[] {
  const sets = LESSON_MATCHING_PAIRS[lesson.id] ?? [];
  const langName = translationLanguageName(translationLang);

  return shuffle(sets)
    .slice(0, MAX_STEPS)
    .map((configs, index) => {
      const pairs: MatchingPairEntry[] = configs.map((config, i) => {
        const resolved =
          translationLang !== "en" && config[translationLang]
            ? config[translationLang]!
            : config.english;
        return {
          pairId: `pair-${i}`,
          english: resolved,
          luxembourgish: config.luxembourgish,
        };
      });

      const summary = pairs
        .map((p) => `${p.english} ↔ ${p.luxembourgish}`)
        .join(" · ");

      const explain: TranslationExplain = {
        highlightWord: pairs[0]?.luxembourgish ?? "",
        meaning: `Match each ${langName} word or phrase to its Luxembourgish partner. ${summary}`,
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
