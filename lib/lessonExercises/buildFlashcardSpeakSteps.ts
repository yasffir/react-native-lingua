import { translationLanguageName } from "@/lib/translation";
import { shuffle } from "@/lib/lessonExercises/shuffle";
import type { Lesson, TranslationLanguage, VocabularyItem } from "@/types/learning";
import type {
  FlashcardSpeakExerciseStep,
  TranslationExplain,
} from "@/types/lessonExercise";

const MAX_STEPS = 3;

function translationLabel(translation: string): string {
  return translation.split("—")[0].trim().toLowerCase();
}

function buildExplain(
  item: VocabularyItem,
  translated: string,
  langName: string
): TranslationExplain {
  return {
    highlightWord: item.word,
    meaning: `Say "${item.word}" when you mean "${translated}" in ${langName}.`,
    examples: [item.word, `${item.word}!`],
  };
}

export function buildFlashcardSpeakSteps(
  lesson: Lesson,
  translationLang: TranslationLanguage = "en"
): FlashcardSpeakExerciseStep[] {
  if (lesson.vocabulary.length === 0) return [];

  const langName = translationLanguageName(translationLang);

  return shuffle(lesson.vocabulary)
    .slice(0, MAX_STEPS)
    .map((item) => {
      const translated = translationLabel(item.translation);
      return {
        type: "flashcard_speak" as const,
        id: `${lesson.id}-flashcard-${item.word}`,
        luxembourgishWord: item.word,
        englishWord: translated,
        pronunciation: item.pronunciation,
        audioId: item.audioId,
        explain: buildExplain(item, translated, langName),
      };
    });
}
