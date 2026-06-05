import type { Lesson } from "@/types/learning";

/** First lesson in unit order that the user has not completed yet. */
export function getNextLesson(
  lessons: Lesson[],
  completedLessonIds: string[]
): Lesson | null {
  return (
    lessons.find((lesson) => !completedLessonIds.includes(lesson.id)) ?? null
  );
}
