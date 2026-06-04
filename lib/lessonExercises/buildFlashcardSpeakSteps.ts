import { shuffle } from "@/lib/lessonExercises/shuffle";
import type { Lesson, VocabularyItem } from "@/types/learning";
import type {
  FlashcardSpeakExerciseStep,
  TranslationExplain,
} from "@/types/lessonExercise";

const MAX_STEPS = 3;

function englishLabel(translation: string): string {
  return translation.split("—")[0].trim().toLowerCase();
}

function buildExplain(item: VocabularyItem, english: string): TranslationExplain {
  return {
    highlightWord: item.word,
    meaning: `Say "${item.word}" when you mean "${english}" in English.`,
    examples: [item.word, `${item.word}!`],
  };
}

export function buildFlashcardSpeakSteps(
  lesson: Lesson
): FlashcardSpeakExerciseStep[] {
  if (lesson.vocabulary.length === 0) return [];

  return shuffle(lesson.vocabulary)
    .slice(0, MAX_STEPS)
    .map((item, index) => {
      const english = englishLabel(item.translation);
      return {
        type: "flashcard_speak" as const,
        id: `${lesson.id}-flashcard-${item.word}`,
        luxembourgishWord: item.word,
        englishWord: english,
        pronunciation: item.pronunciation,
        explain: buildExplain(item, english),
      };
    });
}
