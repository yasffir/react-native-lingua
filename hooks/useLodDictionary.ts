import { useCallback, useEffect, useRef, useState } from "react";

import {
  getLodEntry,
  getRecentLodSearches,
  searchLodDictionary,
} from "@/lib/lod/cache";
import type {
  LodEntrySummary,
  LodRecentSearch,
  LodSearchHit,
} from "@/lib/lod/types";
import { posthog } from "@/lib/posthog";
import { useLanguageStore } from "@/store/languageStore";

interface UseLodDictionaryResult {
  query: string;
  setQuery: (value: string) => void;
  results: LodSearchHit[];
  selectedEntry: LodEntrySummary | null;
  selectedLodId: string | null;
  selectHit: (hit: LodSearchHit) => void;
  clearSelection: () => void;
  recentSearches: LodRecentSearch[];
  searching: boolean;
  entryLoading: boolean;
  error: string | null;
  total: number;
}

export function useLodDictionary(): UseLodDictionaryResult {
  const { translationLanguage } = useLanguageStore();
  const [query, setQueryState] = useState("");
  const [results, setResults] = useState<LodSearchHit[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedLodId, setSelectedLodId] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<LodEntrySummary | null>(
    null
  );
  const [recentSearches, setRecentSearches] = useState<LodRecentSearch[]>([]);
  const [searching, setSearching] = useState(false);
  const [entryLoading, setEntryLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchGenRef = useRef(0);

  useEffect(() => {
    void getRecentLodSearches().then(setRecentSearches);
  }, []);

  const runSearch = useCallback(async (value: string) => {
    const trimmed = value.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setTotal(0);
      setSearching(false);
      setError(null);
      return;
    }

    const generation = ++searchGenRef.current;
    setSearching(true);
    setError(null);

    const page = await searchLodDictionary(trimmed, { translationLang: translationLanguage });
    if (generation !== searchGenRef.current) return;

    if (!page) {
      setResults([]);
      setTotal(0);
      setError("Could not reach the LOD dictionary. Check your connection.");
      setSearching(false);
      return;
    }

    setResults(page.results);
    setTotal(page.total);
    setSearching(false);

    posthog.capture("dictionary_searched", {
      query_length: trimmed.length,
      result_count: page.total,
      translation_language: translationLanguage,
    });
  }, [translationLanguage]);

  const setQuery = useCallback(
    (value: string) => {
      setQueryState(value);
      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (value.trim().length === 0) {
        setResults([]);
        setTotal(0);
        setSearching(false);
        setError(null);
        return;
      }

      debounceRef.current = setTimeout(() => {
        void runSearch(value);
      }, 320);
    },
    [runSearch]
  );

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const selectHit = useCallback((hit: LodSearchHit) => {
    setSelectedLodId(hit.lodId);
    setEntryLoading(true);
    setError(null);

    void (async () => {
      const entry = await getLodEntry(hit.lodId);
      setSelectedEntry(entry);
      setEntryLoading(false);

      posthog.capture("dictionary_entry_viewed", {
        lod_id: hit.lodId,
        lemma: hit.lemma,
      });

      void getRecentLodSearches().then(setRecentSearches);
    })();
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedLodId(null);
    setSelectedEntry(null);
    setEntryLoading(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    selectedEntry,
    selectedLodId,
    selectHit,
    clearSelection,
    recentSearches,
    searching,
    entryLoading,
    error,
    total,
  };
}
