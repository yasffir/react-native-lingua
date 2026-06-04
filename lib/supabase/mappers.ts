import type { LanguageRow, LessonRow, UnitRow } from "@/lib/supabase/types";
import type { Language, Lesson, Unit } from "@/types/learning";

export function mapLanguageRow(row: LanguageRow): Language {
  return {
    code: row.code as Language["code"],
    name: row.name,
    nativeName: row.native_name,
    flag: row.flag,
    color: row.color,
    learners: row.learners,
  };
}

export function mapUnitRow(row: UnitRow): Unit {
  return {
    id: row.id,
    languageCode: row.language_code as Unit["languageCode"],
    title: row.title,
    description: row.description,
    order: row.order_index,
    lessonIds: row.lesson_ids,
  };
}

export function mapLessonRow(row: LessonRow): Lesson {
  return {
    id: row.id,
    unitId: row.unit_id,
    title: row.title,
    description: row.description,
    icon: row.icon,
    xpReward: row.xp_reward,
    goals: row.goals,
    vocabulary: row.vocabulary,
    phrases: row.phrases,
    activities: row.activities,
    aiTeacherPrompt: row.ai_teacher_prompt,
  };
}

export function languageToRow(lang: Language): LanguageRow {
  return {
    code: lang.code,
    name: lang.name,
    native_name: lang.nativeName,
    flag: lang.flag,
    color: lang.color,
    learners: lang.learners,
  };
}

export function unitToRow(unit: Unit): UnitRow {
  return {
    id: unit.id,
    language_code: unit.languageCode,
    title: unit.title,
    description: unit.description,
    order_index: unit.order,
    lesson_ids: unit.lessonIds,
  };
}

export function lessonToRow(lesson: Lesson): LessonRow {
  return {
    id: lesson.id,
    unit_id: lesson.unitId,
    title: lesson.title,
    description: lesson.description,
    icon: lesson.icon,
    xp_reward: lesson.xpReward,
    goals: lesson.goals,
    vocabulary: lesson.vocabulary,
    phrases: lesson.phrases,
    activities: lesson.activities,
    ai_teacher_prompt: lesson.aiTeacherPrompt,
  };
}
