import { collectTemplatesForLesson } from "@/lib/curriculum/exerciseTemplates/collect";
import type { ExerciseStepTemplate } from "@/types/exerciseTemplate";

export function getLocalExerciseTemplates(
  lessonId: string
): ExerciseStepTemplate[] {
  return collectTemplatesForLesson(lessonId);
}
