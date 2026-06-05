import {
  mapLanguageRow,
  mapLessonRow,
  mapUnitRow,
} from "@/lib/supabase/mappers";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Language, Lesson, Unit } from "@/types/learning";
import type { LanguageCode } from "@/types/learning";

export async function fetchLanguages(
  supabase: SupabaseClient
): Promise<Language[]> {
  const { data, error } = await supabase
    .from("languages")
    .select("*")
    .order("name");

  if (error) throw error;
  return (data ?? []).map(mapLanguageRow);
}

export async function fetchUnitForLanguage(
  supabase: SupabaseClient,
  languageCode: LanguageCode
): Promise<Unit | null> {
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .eq("language_code", languageCode)
    .order("order_index")
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data ? mapUnitRow(data) : null;
}

export async function fetchAllUnitsForLanguage(
  supabase: SupabaseClient,
  languageCode: LanguageCode
): Promise<Unit[]> {
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .eq("language_code", languageCode)
    .order("order_index");
  if (error) throw error;
  return (data ?? []).map(mapUnitRow);
}

export async function fetchAllLessonsForLanguage(
  supabase: SupabaseClient,
  languageCode: LanguageCode
): Promise<Lesson[]> {
  const units = await fetchAllUnitsForLanguage(supabase, languageCode);
  const lessonIds = units.flatMap((unit) => unit.lessonIds);
  return fetchLessonsByIds(supabase, lessonIds);
}

export async function fetchLessonsByIds(
  supabase: SupabaseClient,
  lessonIds: string[]
): Promise<Lesson[]> {
  if (lessonIds.length === 0) return [];

  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .in("id", lessonIds);

  if (error) throw error;

  const byId = new Map((data ?? []).map((row) => [row.id, mapLessonRow(row)]));
  return lessonIds
    .map((id) => byId.get(id))
    .filter((lesson): lesson is Lesson => Boolean(lesson));
}

export async function fetchLessonById(
  supabase: SupabaseClient,
  lessonId: string
): Promise<Lesson | null> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .maybeSingle();

  if (error) throw error;
  return data ? mapLessonRow(data) : null;
}

export async function fetchAllLessons(
  supabase: SupabaseClient
): Promise<Lesson[]> {
  const { data, error } = await supabase.from("lessons").select("*");
  if (error) throw error;
  return (data ?? []).map(mapLessonRow);
}
