import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  fetchLodAdvancedSearch,
  fetchLodEntry,
  fetchLodWordOfTheDay,
} from "@/lib/lod/api";
import {
  mergeSearchHits,
  searchLocalLodIndex,
} from "@/lib/lod/searchLocalIndex";
import type {
  LodEntrySummary,
  LodRecentSearch,
  LodSearchPage,
  LodWordOfTheDay,
} from "@/lib/lod/types";
import type { TranslationLanguage } from "@/types/learning";

const ENTRY_PREFIX = "lod:entry:";
const SEARCH_PREFIX = "lod:search:";
const WOTD_KEY = "lod:word-of-the-day";
const RECENT_KEY = "lod:recent-searches";

const ENTRY_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const SEARCH_TTL_MS = 60 * 60 * 1000;
const MAX_RECENT_SEARCHES = 8;
const MAX_PREFETCH = 24;

interface CacheEnvelope<T> {
  cachedAt: number;
  data: T;
}

const memoryEntries = new Map<string, LodEntrySummary>();
const memorySearch = new Map<string, LodSearchPage>();
let memoryWordOfTheDay: LodWordOfTheDay | null = null;
let memoryWordOfTheDayDateKey: string | null = null;
const inflightEntries = new Map<string, Promise<LodEntrySummary | null>>();

function isFresh(cachedAt: number, ttlMs: number): boolean {
  return Date.now() - cachedAt < ttlMs;
}

function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

async function readEntryFromStorage(
  lodId: string
): Promise<LodEntrySummary | null> {
  try {
    const raw = await AsyncStorage.getItem(`${ENTRY_PREFIX}${lodId}`);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as CacheEnvelope<LodEntrySummary>;
    if (!isFresh(envelope.cachedAt, ENTRY_TTL_MS)) {
      await AsyncStorage.removeItem(`${ENTRY_PREFIX}${lodId}`);
      return null;
    }
    return envelope.data;
  } catch {
    return null;
  }
}

async function writeEntryToStorage(entry: LodEntrySummary): Promise<void> {
  try {
    const envelope: CacheEnvelope<LodEntrySummary> = {
      cachedAt: Date.now(),
      data: entry,
    };
    await AsyncStorage.setItem(
      `${ENTRY_PREFIX}${entry.lodId}`,
      JSON.stringify(envelope)
    );
  } catch {
    // Cache write failures should not break the app.
  }
}

async function readSearchFromStorage(
  cacheKey: string
): Promise<LodSearchPage | null> {
  try {
    const key = `${SEARCH_PREFIX}${cacheKey}`;
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as CacheEnvelope<LodSearchPage>;
    if (!isFresh(envelope.cachedAt, SEARCH_TTL_MS)) {
      await AsyncStorage.removeItem(key);
      return null;
    }
    return envelope.data;
  } catch {
    return null;
  }
}

async function writeSearchToStorage(
  cacheKey: string,
  page: LodSearchPage
): Promise<void> {
  try {
    const envelope: CacheEnvelope<LodSearchPage> = {
      cachedAt: Date.now(),
      data: page,
    };
    await AsyncStorage.setItem(
      `${SEARCH_PREFIX}${cacheKey}`,
      JSON.stringify(envelope)
    );
  } catch {
    // ignore
  }
}

/** Clear in-memory LOD cache (dev / after logout if needed). */
export function resetLodMemoryCache(): void {
  memoryEntries.clear();
  memorySearch.clear();
  memoryWordOfTheDay = null;
  memoryWordOfTheDayDateKey = null;
  inflightEntries.clear();
}

export async function getLodEntry(
  lodId: string | undefined
): Promise<LodEntrySummary | null> {
  if (!lodId) return null;

  const cached = memoryEntries.get(lodId);
  if (cached && isFresh(cached.fetchedAt, ENTRY_TTL_MS)) return cached;

  const stored = await readEntryFromStorage(lodId);
  if (stored) {
    memoryEntries.set(lodId, stored);
    return stored;
  }

  const inflight = inflightEntries.get(lodId);
  if (inflight) return inflight;

  const request = (async () => {
    const entry = await fetchLodEntry(lodId);
    if (entry) {
      memoryEntries.set(lodId, entry);
      await writeEntryToStorage(entry);
    }
    inflightEntries.delete(lodId);
    return entry;
  })();

  inflightEntries.set(lodId, request);
  return request;
}

/** Warm entry cache for lesson vocabulary (best-effort, capped). */
export async function prefetchLodEntries(lodIds: string[]): Promise<void> {
  const unique = [...new Set(lodIds.filter(Boolean))].slice(0, MAX_PREFETCH);
  const pending: string[] = [];

  for (const lodId of unique) {
    const cached = memoryEntries.get(lodId);
    if (cached && isFresh(cached.fetchedAt, ENTRY_TTL_MS)) continue;
    pending.push(lodId);
  }

  for (let i = 0; i < pending.length; i += 4) {
    const batch = pending.slice(i, i + 4);
    await Promise.all(batch.map((lodId) => getLodEntry(lodId)));
  }
}

export async function searchLodDictionary(
  query: string,
  options: { page?: number; translationLang?: TranslationLanguage } = {}
): Promise<LodSearchPage | null> {
  const page = options.page ?? 1;
  const translationLang = options.translationLang ?? "en";
  const trimmed = query.trim();
  if (trimmed.length < 2) {
    return { results: [], total: 0, pageCount: 0, currentPage: 1 };
  }

  const cacheKey = `${normalizeSearchQuery(trimmed)}:${translationLang}`;

  if (page === 1) {
    const cached = memorySearch.get(cacheKey);
    if (cached) return cached;

    const stored = await readSearchFromStorage(cacheKey);
    if (stored) {
      memorySearch.set(cacheKey, stored);
      return stored;
    }
  }

  const localHits = page === 1 ? searchLocalLodIndex(trimmed, translationLang) : [];
  const remote = await fetchLodAdvancedSearch(trimmed, page);

  if (!remote && localHits.length === 0) return null;

  const result: LodSearchPage = {
    results: mergeSearchHits(localHits, remote?.results ?? []),
    total: 0,
    pageCount: remote?.pageCount ?? (localHits.length > 0 ? 1 : 0),
    currentPage: remote?.currentPage ?? 1,
  };
  result.total = result.results.length;

  if (page === 1) {
    memorySearch.set(cacheKey, result);
    await writeSearchToStorage(cacheKey, result);
    await rememberRecentSearch(trimmed);
  }

  return result;
}

export async function getRecentLodSearches(): Promise<LodRecentSearch[]> {
  try {
    const raw = await AsyncStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const items = JSON.parse(raw) as LodRecentSearch[];
    return items.slice(0, MAX_RECENT_SEARCHES);
  } catch {
    return [];
  }
}

async function rememberRecentSearch(query: string): Promise<void> {
  const normalized = normalizeSearchQuery(query);
  if (normalized.length < 2) return;

  try {
    const existing = await getRecentLodSearches();
    const next: LodRecentSearch[] = [
      { query: query.trim(), searchedAt: Date.now() },
      ...existing.filter((item) => normalizeSearchQuery(item.query) !== normalized),
    ].slice(0, MAX_RECENT_SEARCHES);
    await AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // ignore
  }
}

interface CachedWordOfTheDay {
  dateKey: string;
  word: LodWordOfTheDay;
}

async function readWordOfTheDayFromStorage(
  dateKey: string
): Promise<LodWordOfTheDay | null> {
  try {
    const raw = await AsyncStorage.getItem(WOTD_KEY);
    if (!raw) return null;
    const envelope = JSON.parse(raw) as CacheEnvelope<CachedWordOfTheDay>;
    if (envelope.data.dateKey !== dateKey) return null;
    if (!isFresh(envelope.cachedAt, ENTRY_TTL_MS)) return null;
    return envelope.data.word;
  } catch {
    return null;
  }
}

async function writeWordOfTheDayToStorage(
  dateKey: string,
  word: LodWordOfTheDay
): Promise<void> {
  try {
    const envelope: CacheEnvelope<CachedWordOfTheDay> = {
      cachedAt: Date.now(),
      data: { dateKey, word },
    };
    await AsyncStorage.setItem(WOTD_KEY, JSON.stringify(envelope));
  } catch {
    // ignore
  }
}

export async function getLodWordOfTheDay(
  dateKey: string
): Promise<LodWordOfTheDay | null> {
  if (memoryWordOfTheDay && memoryWordOfTheDayDateKey === dateKey) {
    return memoryWordOfTheDay;
  }

  const stored = await readWordOfTheDayFromStorage(dateKey);
  if (stored) {
    memoryWordOfTheDay = stored;
    memoryWordOfTheDayDateKey = dateKey;
    return stored;
  }

  const word = await fetchLodWordOfTheDay();
  if (!word) return null;

  memoryWordOfTheDay = word;
  memoryWordOfTheDayDateKey = dateKey;
  await writeWordOfTheDayToStorage(dateKey, word);
  return word;
}
