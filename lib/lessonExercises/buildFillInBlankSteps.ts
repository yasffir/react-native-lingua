import { LESSON_FILL_IN_BLANK } from "@/data/fillInBlank";
import { shuffle } from "@/lib/lessonExercises/shuffle";
import type { Lesson } from "@/types/learning";
import type {
  FillInBlankExerciseStep,
  FillInBlankOption,
  TranslationExplain,
} from "@/types/lessonExercise";

const MAX_STEPS = 2;

export function buildFillInBlankSteps(lesson: Lesson): FillInBlankExerciseStep[] {
  const configs = LESSON_FILL_IN_BLANK[lesson.id] ?? [];
  return shuffle(configs)
    .slice(0, MAX_STEPS)
    .map((config, index) => {
      const options: FillInBlankOption[] = shuffle(config.bank).map(
        (word) => ({
          id: word,
          text: word,
        })
      );

      const explain: TranslationExplain =
        config.explain ?? {
          highlightWord: config.correctWord,
          meaning: `The full sentence is: ${config.fullSentence} (${config.englishHint})`,
          examples: [config.fullSentence],
        };

      return {
        type: "fill_in_blank" as const,
        id: `${lesson.id}-fill-${index}`,
        before: config.before,
        after: config.after,
        correctOptionId: config.correctWord,
        fullSentence: config.fullSentence,
        englishHint: config.englishHint,
        visual: config.visual,
        options,
        explain,
      };
    });
}
