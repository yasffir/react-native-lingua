import { mapExerciseTemplateRow } from "@/lib/supabase/mappers";
import { TABLES } from "@/lib/supabase/tables";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { ExerciseStepTemplate } from "@/types/exerciseTemplate";

export async function fetchExerciseTemplatesForLesson(
  supabase: SupabaseClient,
  lessonId: string
): Promise<ExerciseStepTemplate[]> {
  const { data, error } = await supabase
    .from(TABLES.exerciseStepTemplates)
    .select("*")
    .eq("lesson_id", lessonId)
    .order("sort_order");

  if (error) throw error;
  return (data ?? []).map(mapExerciseTemplateRow);
}
