import type { Unit } from "@/types/learning";

/** First unit with an incomplete lesson, or the last unit when everything is done. */
export function getCurrentUnitIndex(
  units: Unit[],
  completedLessonIds: string[]
): number {
  if (units.length === 0) return 0;

  for (let i = 0; i < units.length; i++) {
    const unit = units[i]!;
    const hasIncomplete = unit.lessonIds.some(
      (lessonId) => !completedLessonIds.includes(lessonId)
    );
    if (hasIncomplete) return i;
  }

  return units.length - 1;
}
