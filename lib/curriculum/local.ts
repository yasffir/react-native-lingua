import { LANGUAGES } from "@/data/languages";
import { LESSONS } from "@/data/lessons";
import { UNITS } from "@/data/units";
import type { Language, Lesson, Unit } from "@/types/learning";
import type { LanguageCode } from "@/types/learning";

export function getLocalLanguages(): Language[] {
  return LANGUAGES;
}

export function getLocalUnit(languageCode: LanguageCode): Unit | null {
  return UNITS.find((u) => u.languageCode === languageCode) ?? null;
}

export function getLocalUnitsForLanguage(languageCode: LanguageCode): Unit[] {
  return UNITS.filter((u) => u.languageCode === languageCode);
}

export function getLocalLessonsForUnit(unit: Unit): Lesson[] {
  return unit.lessonIds
    .map((id) => LESSONS.find((l) => l.id === id))
    .filter((l): l is Lesson => Boolean(l));
}

/** All lessons for a language in unit order (for progress / AI Teacher routing). */
export function getAllLocalLessonsForLanguage(
  languageCode: LanguageCode
): Lesson[] {
  return getLocalUnitsForLanguage(languageCode).flatMap(getLocalLessonsForUnit);
}

export function getLocalLesson(lessonId: string): Lesson | null {
  return LESSONS.find((l) => l.id === lessonId) ?? null;
}

export function getLocalLessonIndex(lessonId: string): number {
  return LESSONS.findIndex((l) => l.id === lessonId);
}
