import { buildChatSteps } from "@/lib/lessonExercises/buildChatSteps";
import { buildFillInBlankSteps } from "@/lib/lessonExercises/buildFillInBlankSteps";
import { buildMatchingPairsSteps } from "@/lib/lessonExercises/buildMatchingPairsSteps";
import { buildFlashcardSpeakSteps } from "@/lib/lessonExercises/buildFlashcardSpeakSteps";
import { buildSelectTranslationSteps } from "@/lib/lessonExercises/buildSelectTranslationSteps";
import { buildTranslationSteps } from "@/lib/lessonExercises/buildTranslationSteps";
import { buildPictureMatchSteps } from "@/lib/pictureMatch/buildSteps";
import { shuffle } from "@/lib/lessonExercises/shuffle";
import type { Lesson } from "@/types/learning";
import type { LessonExerciseStep } from "@/types/lessonExercise";

const MAX_PICTURE_STEPS = 3;
const MAX_TOTAL_STEPS = 12;

/** Mixed exercise session: picture-match, translate, chat, select-translation. */
export function buildLessonSteps(lesson: Lesson): LessonExerciseStep[] {
  const picture = shuffle(buildPictureMatchSteps(lesson))
    .slice(0, MAX_PICTURE_STEPS)
    .map(
      (step) =>
        ({
          type: "picture_match",
          ...step,
        }) satisfies LessonExerciseStep
    );

  const translate = buildTranslationSteps(lesson);
  const chat = buildChatSteps(lesson);
  const selectTranslation = buildSelectTranslationSteps(lesson);
  const flashcardSpeak = buildFlashcardSpeakSteps(lesson);
  const fillInBlank = buildFillInBlankSteps(lesson);
  const matchingPairs = buildMatchingPairsSteps(lesson);

  const combined: LessonExerciseStep[] = shuffle([
    ...picture,
    ...translate,
    ...chat,
    ...selectTranslation,
    ...flashcardSpeak,
    ...fillInBlank,
    ...matchingPairs,
  ]);

  if (combined.length === 0) return [];
  return combined.slice(0, MAX_TOTAL_STEPS);
}
