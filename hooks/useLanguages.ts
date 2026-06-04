import { useCallback, useEffect, useState } from "react";

import { fetchLanguages } from "@/lib/curriculum/remote";
import { getLocalLanguages } from "@/lib/curriculum/local";
import { isSupabaseConfigured } from "@/lib/config";
import { useSupabase } from "@/hooks/useSupabase";
import type { Language } from "@/types/learning";

export function useLanguages() {
  const supabase = useSupabase();
  const [languages, setLanguages] = useState<Language[]>(
    isSupabaseConfigured ? [] : getLocalLanguages()
  );
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setLanguages(getLocalLanguages());
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      setLanguages(await fetchLanguages(supabase));
    } catch (e) {
      console.warn("[useLanguages] Supabase failed, using local data:", e);
      setLanguages(getLocalLanguages());
      setError(e instanceof Error ? e.message : "Failed to load languages");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { languages, loading, error, refresh };
}
