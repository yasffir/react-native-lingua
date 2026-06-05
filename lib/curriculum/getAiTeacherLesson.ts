import type { Lesson } from "@/types/learning";

import { getNextLesson } from "@/lib/curriculum/getNextLesson";

/** Lesson Luna should use — next incomplete in the full path, or last lesson when all are done. */
export function getAiTeacherLesson(
  lessons: Lesson[],
  completedLessonIds: string[]
): Lesson | null {
  const next = getNextLesson(lessons, completedLessonIds);
  if (next) return next;
  return lessons.length > 0 ? lessons[lessons.length - 1]! : null;
}
