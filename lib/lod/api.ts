import {
  parseLodEntryResponse,
  parseWordOfTheDayResponse,
} from "@/lib/lod/parseEntry";
import { parseLodAdvancedSearchResponse } from "@/lib/lod/parseSearch";
import type {
  LodEntrySummary,
  LodSearchPage,
  LodWordOfTheDay,
} from "@/lib/lod/types";

const LOD_API = "https://lod.lu/api/lb";

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchLodEntry(
  lodId: string
): Promise<LodEntrySummary | null> {
  const json = await fetchJson<unknown>(
    `${LOD_API}/entry/${encodeURIComponent(lodId)}`
  );
  if (!json) return null;
  return parseLodEntryResponse(json as Parameters<typeof parseLodEntryResponse>[0]);
}

export async function fetchLodWordOfTheDay(): Promise<LodWordOfTheDay | null> {
  const json = await fetchJson<{
    lod_id?: string;
    lemma?: string;
    start_at?: string;
  }>(`${LOD_API}/word-of-the-day`);
  if (!json) return null;
  return parseWordOfTheDayResponse(json);
}

/** Luxembourgish lemma search via LOD advanced-search. */
export async function fetchLodAdvancedSearch(
  query: string,
  page = 1
): Promise<LodSearchPage | null> {
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { results: [], total: 0, pageCount: 0, currentPage: 1 };
  }

  const params = new URLSearchParams({
    query: trimmed,
    page: String(page),
  });
  const json = await fetchJson<unknown>(
    `${LOD_API}/advanced-search?${params.toString()}`
  );
  if (!json) return null;
  return parseLodAdvancedSearchResponse(
    json as Parameters<typeof parseLodAdvancedSearchResponse>[0]
  );
}
