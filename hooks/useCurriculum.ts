import { useCallback, useEffect, useRef, useState } from "react";

import {
  fetchAllLessonsForLanguage,
  fetchAllUnitsForLanguage,
  fetchLessonsByIds,
} from "@/lib/curriculum/remote";
import {
  getAllLocalLessonsForLanguage,
  getLocalLessonsForUnit,
  getLocalUnitsForLanguage,
} from "@/lib/curriculum/local";
import { isSupabaseConfigured } from "@/lib/config";
import { useSupabase } from "@/hooks/useSupabase";
import type { LanguageCode, Lesson, Unit } from "@/types/learning";

export function useCurriculum(languageCode: LanguageCode | null) {
  const supabase = useSupabase();
  const supabaseRef = useRef(supabase);
  supabaseRef.current = supabase;

  const [units, setUnits] = useState<Unit[]>(() =>
    languageCode ? getLocalUnitsForLanguage(languageCode) : []
  );
  const [unitIndex, setUnitIndex] = useState(0);
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    if (!languageCode) return [];
    const localUnits = getLocalUnitsForLanguage(languageCode);
    return localUnits.length > 0 ? getLocalLessonsForUnit(localUnits[0]) : [];
  });
  const [allLessons, setAllLessons] = useState<Lesson[]>(() =>
    languageCode ? getAllLocalLessonsForLanguage(languageCode) : []
  );
  const [loading, setLoading] = useState(
    () => Boolean(languageCode) && isSupabaseConfigured
  );
  const [error, setError] = useState<string | null>(null);
  const loadedLanguageRef = useRef<LanguageCode | null>(null);

  const unit = units[unitIndex] ?? null;

  // Fetch lessons when unitIndex changes (and units are already loaded)
  const loadLessonsForUnit = useCallback(
    async (targetUnit: Unit | null) => {
      if (!targetUnit) {
        setLessons([]);
        return;
      }

      const client = supabaseRef.current;
      if (!isSupabaseConfigured || !client) {
        setLessons(getLocalLessonsForUnit(targetUnit));
        return;
      }

      try {
        setLessons(await fetchLessonsByIds(client, targetUnit.lessonIds));
      } catch (e) {
        console.warn("[useCurriculum] Failed to fetch lessons, using local:", e);
        setLessons(getLocalLessonsForUnit(targetUnit));
      }
    },
    []
  );

  const refresh = useCallback(async () => {
    if (!languageCode) {
      setUnits([]);
      setLessons([]);
      setAllLessons([]);
      setLoading(false);
      setUnitIndex(0);
      loadedLanguageRef.current = null;
      return;
    }

    const client = supabaseRef.current;
    const isInitialLoad = loadedLanguageRef.current !== languageCode;

    if (!isSupabaseConfigured || !client) {
      const localUnits = getLocalUnitsForLanguage(languageCode);
      setUnits(localUnits);
      setAllLessons(getAllLocalLessonsForLanguage(languageCode));
      if (isInitialLoad) setUnitIndex(0);
      const activeUnit = localUnits[isInitialLoad ? 0 : unitIndex] ?? null;
      setLessons(activeUnit ? getLocalLessonsForUnit(activeUnit) : []);
      setLoading(false);
      if (!isSupabaseConfigured) {
        loadedLanguageRef.current = languageCode;
      }
      return;
    }

    if (isInitialLoad) {
      setLoading(true);
      setUnitIndex(0);
    }
    setError(null);

    try {
      const remoteUnits = await fetchAllUnitsForLanguage(client, languageCode);
      setUnits(remoteUnits);
      setAllLessons(await fetchAllLessonsForLanguage(client, languageCode));
      const activeUnit = remoteUnits[isInitialLoad ? 0 : unitIndex] ?? null;
      if (activeUnit) {
        setLessons(await fetchLessonsByIds(client, activeUnit.lessonIds));
      } else {
        setLessons([]);
      }
      loadedLanguageRef.current = languageCode;
    } catch (e) {
      console.warn("[useCurriculum] Supabase failed, using local data:", e);
      const localUnits = getLocalUnitsForLanguage(languageCode);
      setUnits(localUnits);
      setAllLessons(getAllLocalLessonsForLanguage(languageCode));
      const activeUnit = localUnits[isInitialLoad ? 0 : unitIndex] ?? null;
      setLessons(activeUnit ? getLocalLessonsForUnit(activeUnit) : []);
      setError(e instanceof Error ? e.message : "Failed to load curriculum");
      loadedLanguageRef.current = languageCode;
    } finally {
      setLoading(false);
    }
  }, [languageCode, unitIndex]);

  useEffect(() => {
    refresh();
  }, [refresh, supabase]);

  // When unitIndex changes after initial load, fetch lessons for the new unit
  const prevUnitIndexRef = useRef(unitIndex);
  useEffect(() => {
    if (prevUnitIndexRef.current !== unitIndex && loadedLanguageRef.current) {
      prevUnitIndexRef.current = unitIndex;
      loadLessonsForUnit(units[unitIndex] ?? null);
    }
  }, [unitIndex, units, loadLessonsForUnit]);

  return { unit, units, lessons, allLessons, loading, error, refresh, setUnitIndex };
}
