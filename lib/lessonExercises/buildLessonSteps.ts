import { assembleLessonSteps } from "@/lib/curriculum/exerciseTemplates/assemble";
import { collectTemplatesForLesson } from "@/lib/curriculum/exerciseTemplates/collect";
import type { Lesson, TranslationLanguage } from "@/types/learning";
import type { ExerciseStepTemplate } from "@/types/exerciseTemplate";
import type { LessonExerciseStep } from "@/types/lessonExercise";

/**
 * Build a mixed exercise session from templates (DB or local fallback).
 * When templates is omitted, uses bundled data/ exercise configs.
 */
export function buildLessonSteps(
  lesson: Lesson,
  translationLang: TranslationLanguage = "en",
  templates?: ExerciseStepTemplate[]
): LessonExerciseStep[] {
  const resolved =
    templates && templates.length > 0
      ? templates
      : collectTemplatesForLesson(lesson.id);

  return assembleLessonSteps(lesson, resolved, translationLang);
}
