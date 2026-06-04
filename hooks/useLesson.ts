import { useCallback, useEffect, useState } from "react";

import { fetchAllLessons, fetchLessonById } from "@/lib/curriculum/remote";
import {
  getLocalLesson,
  getLocalLessonIndex,
} from "@/lib/curriculum/local";
import { isSupabaseConfigured } from "@/lib/config";
import { useSupabase } from "@/hooks/useSupabase";
import type { Lesson } from "@/types/learning";

export function useLesson(lessonId: string | undefined) {
  const supabase = useSupabase();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [loading, setLoading] = useState(Boolean(lessonId));
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!lessonId) {
      setLesson(null);
      setLessonIndex(0);
      setLoading(false);
      return;
    }

    if (!isSupabaseConfigured || !supabase) {
      setLesson(getLocalLesson(lessonId));
      setLessonIndex(getLocalLessonIndex(lessonId));
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const remoteLesson = await fetchLessonById(supabase, lessonId);
      setLesson(remoteLesson);
      const all = await fetchAllLessons(supabase);
      setLessonIndex(all.findIndex((l) => l.id === lessonId));
    } catch (e) {
      console.warn("[useLesson] Supabase failed, using local data:", e);
      setLesson(getLocalLesson(lessonId));
      setLessonIndex(getLocalLessonIndex(lessonId));
      setError(e instanceof Error ? e.message : "Failed to load lesson");
    } finally {
      setLoading(false);
    }
  }, [lessonId, supabase]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { lesson, lessonIndex, loading, error, refresh };
}
