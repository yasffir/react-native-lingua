import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchLessonsByIds,
  fetchUnitForLanguage,
} from "@/lib/curriculum/remote";
import {
  getLocalLessonsForUnit,
  getLocalUnit,
} from "@/lib/curriculum/local";
import { isSupabaseConfigured } from "@/lib/config";
import { useSupabase } from "@/hooks/useSupabase";
import type { LanguageCode, Lesson, Unit } from "@/types/learning";

export function useCurriculum(languageCode: LanguageCode | null) {
  const supabase = useSupabase();
  const supabaseRef = useRef(supabase);
  supabaseRef.current = supabase;

  const [unit, setUnit] = useState<Unit | null>(() =>
    languageCode ? getLocalUnit(languageCode) : null
  );
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    if (!languageCode) return [];
    const localUnit = getLocalUnit(languageCode);
    return localUnit ? getLocalLessonsForUnit(localUnit) : [];
  });
  const [loading, setLoading] = useState(
    () => Boolean(languageCode) && isSupabaseConfigured
  );
  const [error, setError] = useState<string | null>(null);
  const loadedLanguageRef = useRef<LanguageCode | null>(null);

  const refresh = useCallback(async () => {
    if (!languageCode) {
      setUnit(null);
      setLessons([]);
      setLoading(false);
      loadedLanguageRef.current = null;
      return;
    }

    const client = supabaseRef.current;
    const isInitialLoad = loadedLanguageRef.current !== languageCode;

    if (!isSupabaseConfigured || !client) {
      const localUnit = getLocalUnit(languageCode);
      setUnit(localUnit);
      setLessons(localUnit ? getLocalLessonsForUnit(localUnit) : []);
      setLoading(false);
      if (!isSupabaseConfigured) {
        loadedLanguageRef.current = languageCode;
      }
      return;
    }

    if (isInitialLoad) {
      setLoading(true);
    }
    setError(null);

    try {
      const remoteUnit = await fetchUnitForLanguage(client, languageCode);
      setUnit(remoteUnit);
      if (remoteUnit) {
        setLessons(await fetchLessonsByIds(client, remoteUnit.lessonIds));
      } else {
        setLessons([]);
      }
      loadedLanguageRef.current = languageCode;
    } catch (e) {
      console.warn("[useCurriculum] Supabase failed, using local data:", e);
      const localUnit = getLocalUnit(languageCode);
      setUnit(localUnit);
      setLessons(localUnit ? getLocalLessonsForUnit(localUnit) : []);
      setError(e instanceof Error ? e.message : "Failed to load curriculum");
      loadedLanguageRef.current = languageCode;
    } finally {
      setLoading(false);
    }
  }, [languageCode]);

  useEffect(() => {
    refresh();
  }, [refresh, supabase]);

  return { unit, lessons, loading, error, refresh };
}
