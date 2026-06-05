import { useEffect, useState } from "react";

import { getLodEntry } from "@/lib/lod/cache";
import type { LodEntrySummary } from "@/lib/lod/types";

interface UseLodEntryResult {
  entry: LodEntrySummary | null;
  loading: boolean;
}

export function useLodEntry(lodId: string | undefined): UseLodEntryResult {
  const [entry, setEntry] = useState<LodEntrySummary | null>(null);
  const [loading, setLoading] = useState(Boolean(lodId));

  useEffect(() => {
    if (!lodId) {
      setEntry(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    void getLodEntry(lodId).then((result) => {
      if (cancelled) return;
      setEntry(result);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [lodId]);

  return { entry, loading };
}
