import { translationLanguageName } from "@/lib/translation";
import { shuffle } from "@/lib/lessonExercises/shuffle";
import type { Lesson, TranslationLanguage, VocabularyItem } from "@/types/learning";
import type {
  SelectTranslationExerciseStep,
  SelectTranslationOption,
  TranslationExplain,
} from "@/types/lessonExercise";

const MAX_STEPS = 4;
const OPTION_COUNT = 3;

function translationLabel(translation: string): string {
  return translation.split("—")[0].trim();
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
  translated: string,
  langName: string
): TranslationExplain {
  return {
    highlightWord: target.word,
    meaning: `"${target.word}" means "${translated}" in ${langName}.`,
    examples: [target.word, `${target.word}!`],
  };
}

export function buildSelectTranslationSteps(
  lesson: Lesson,
  translationLang: TranslationLanguage = "en"
): SelectTranslationExerciseStep[] {
  const vocab = lesson.vocabulary;
  if (vocab.length < OPTION_COUNT) return [];

  const langName = translationLanguageName(translationLang);

  const steps = shuffle(vocab)
    .slice(0, MAX_STEPS)
    .map((target) => {
      const distractors = pickDistractors(vocab, target, OPTION_COUNT - 1);
      const translated = translationLabel(target.translation);

      const options: SelectTranslationOption[] = shuffle([
        { id: target.word, text: translated },
        ...distractors.map((d) => ({
          id: d.word,
          text: translationLabel(d.translation),
        })),
      ]);

      return {
        type: "select_translation" as const,
        id: `${lesson.id}-select-${target.word}`,
        luxembourgishPrompt: target.word,
        audioId: target.audioId,
        options,
        correctOptionId: target.word,
        explain: buildExplain(target, translated, langName),
      };
    });

  return steps;
}
