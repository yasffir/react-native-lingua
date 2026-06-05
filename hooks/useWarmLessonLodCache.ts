import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

import { useCurriculum } from "@/hooks/useCurriculum";
import { useLearningProgress } from "@/hooks/useLearningProgress";
import { getAiTeacherLesson } from "@/lib/curriculum/getAiTeacherLesson";
import { prefetchLodEntries } from "@/lib/lod/cache";
import { useLanguageStore } from "@/store/languageStore";

/** Prefetch LOD entry audio/details for the next lessons (offline-friendly playback). */
export function useWarmLessonLodCache() {
  const { selectedLanguage } = useLanguageStore();
  const { completedLessonIds } = useLearningProgress();
  const { allLessons } = useCurriculum(selectedLanguage);

  useFocusEffect(
    useCallback(() => {
      if (allLessons.length === 0) return;

      const next = getAiTeacherLesson(allLessons, completedLessonIds);
      const nextIndex = next
        ? allLessons.findIndex((lesson) => lesson.id === next.id)
        : 0;

      const warmLessons = allLessons.slice(
        Math.max(0, nextIndex),
        Math.max(0, nextIndex) + 2
      );

      const lodIds = warmLessons.flatMap((lesson) =>
        lesson.vocabulary
          .map((item) => item.audioId)
          .filter((id): id is string => Boolean(id))
      );

      void prefetchLodEntries(lodIds);
    }, [allLessons, completedLessonIds])
  );
}
