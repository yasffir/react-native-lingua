import { useCallback, useEffect, useRef, useState } from "react";

import { getLocalExerciseTemplates } from "@/lib/curriculum/exerciseTemplates/local";
import { fetchExerciseTemplatesForLesson } from "@/lib/curriculum/exerciseTemplates/remote";
import { isSupabaseConfigured } from "@/lib/config";
import { useSupabase } from "@/hooks/useSupabase";
import type { ExerciseStepTemplate } from "@/types/exerciseTemplate";

export function useLessonExerciseTemplates(lessonId: string | undefined) {
  const supabase = useSupabase();
  const supabaseRef = useRef(supabase);
  supabaseRef.current = supabase;

  const [templates, setTemplates] = useState<ExerciseStepTemplate[]>(() =>
    lessonId ? getLocalExerciseTemplates(lessonId) : []
  );
  const [loading, setLoading] = useState(
    Boolean(lessonId) && isSupabaseConfigured
  );
  const [error, setError] = useState<string | null>(null);
  const loadedLessonRef = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    if (!lessonId) {
      setTemplates([]);
      setLoading(false);
      loadedLessonRef.current = null;
      return;
    }

    const client = supabaseRef.current;
    if (!isSupabaseConfigured || !client) {
      setTemplates(getLocalExerciseTemplates(lessonId));
      setLoading(false);
      return;
    }

    const isInitialLoad = loadedLessonRef.current !== lessonId;
    if (isInitialLoad) setLoading(true);
    setError(null);

    try {
      const remote = await fetchExerciseTemplatesForLesson(client, lessonId);
      if (remote.length > 0) {
        setTemplates(remote);
      } else {
        setTemplates(getLocalExerciseTemplates(lessonId));
      }
      loadedLessonRef.current = lessonId;
    } catch (e) {
      console.warn(
        "[useLessonExerciseTemplates] Supabase failed, using local:",
        e
      );
      setTemplates(getLocalExerciseTemplates(lessonId));
      setError(e instanceof Error ? e.message : "Failed to load exercises");
      loadedLessonRef.current = lessonId;
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    refresh();
  }, [refresh, supabase]);

  return { templates, loading, error, refresh };
}
