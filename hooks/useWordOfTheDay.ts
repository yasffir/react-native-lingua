import { useEffect, useState } from "react";

import { getLodEntry, getLodWordOfTheDay } from "@/lib/lod/cache";
import type { LodEntrySummary, LodWordOfTheDay } from "@/lib/lod/types";
import { toDateKey } from "@/lib/progress/dates";

interface UseWordOfTheDayResult {
  word: LodWordOfTheDay | null;
  entry: LodEntrySummary | null;
  loading: boolean;
}

export function useWordOfTheDay(): UseWordOfTheDayResult {
  const [word, setWord] = useState<LodWordOfTheDay | null>(null);
  const [entry, setEntry] = useState<LodEntrySummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setLoading(true);
      const dateKey = toDateKey(new Date());
      const wotd = await getLodWordOfTheDay(dateKey);
      if (cancelled) return;

      setWord(wotd);
      if (wotd?.lodId) {
        const detail = await getLodEntry(wotd.lodId);
        if (!cancelled) setEntry(detail);
      } else {
        setEntry(null);
      }

      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return { word, entry, loading };
}
