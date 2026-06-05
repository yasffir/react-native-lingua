import type { Router } from "expo-router";

import type { Lesson } from "@/types/learning";

export function aiTeacherPath(lessonId: string): `/lesson/${string}/ai-teacher` {
  return `/lesson/${lessonId}/ai-teacher`;
}

export function openAiTeacherSession(
  router: Router,
  lesson: Lesson | null
): boolean {
  if (!lesson) return false;
  router.push(aiTeacherPath(lesson.id));
  return true;
}
