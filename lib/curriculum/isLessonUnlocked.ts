import type { Lesson } from "@/types/learning";

/** True when every earlier lesson in path order is completed (first lesson is always unlocked). */
export function isLessonUnlocked(
  lesson: Lesson,
  allLessons: Lesson[],
  completedLessonIds: string[]
): boolean {
  const index = allLessons.findIndex((item) => item.id === lesson.id);
  if (index <= 0) return true;

  for (let i = 0; i < index; i++) {
    if (!completedLessonIds.includes(allLessons[i]!.id)) {
      return false;
    }
  }

  return true;
}
