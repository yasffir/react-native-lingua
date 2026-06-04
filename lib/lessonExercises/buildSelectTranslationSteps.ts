import { shuffle } from "@/lib/lessonExercises/shuffle";
import type { Lesson, VocabularyItem } from "@/types/learning";
import type {
  SelectTranslationExerciseStep,
  SelectTranslationOption,
  TranslationExplain,
} from "@/types/lessonExercise";

const MAX_STEPS = 4;
const OPTION_COUNT = 3;

function englishPrompt(translation: string): string {
  const base = translation.split("—")[0].trim();
  return base.toLowerCase();
}

function pickDistractors(
  pool: VocabularyItem[],
  target: VocabularyItem,
  count: number
): VocabularyItem[] {
  return shuffle(pool.filter((v) => v.word !== target.word)).slice(0, count);
}

function buildExplain(
  target: VocabularyItem,
  english: string
): TranslationExplain {
  return {
    highlightWord: target.word,
    meaning: `"${english}" in Luxembourgish is ${target.word}.`,
    examples: [target.word, `${target.word}!`],
  };
}

export function buildSelectTranslationSteps(
  lesson: Lesson
): SelectTranslationExerciseStep[] {
  const vocab = lesson.vocabulary;
  if (vocab.length < OPTION_COUNT) return [];

  const steps = shuffle(vocab)
    .slice(0, MAX_STEPS)
    .map((target, index) => {
      const distractors = pickDistractors(vocab, target, OPTION_COUNT - 1);
      const english = englishPrompt(target.translation);

      const options: SelectTranslationOption[] = shuffle([
        { id: target.word, text: target.word },
        ...distractors.map((d) => ({ id: d.word, text: d.word })),
      ]);

      return {
        type: "select_translation" as const,
        id: `${lesson.id}-select-${target.word}`,
        englishPrompt: english,
        options,
        correctOptionId: target.word,
        explain: buildExplain(target, english),
      };
    });

  return steps;
}
