import * as fs from "fs";
import * as path from "path";

import { parseLodEntryResponse } from "../../lib/lod/parseEntry";

const LOD_API = "https://lod.lu/api/lb";
const CACHE_DIR = path.resolve(__dirname, "../../data/lodCache");
const CACHE_FILE = path.join(CACHE_DIR, "gws-a1-entries.json");

export interface GwsA1ListItem {
  article_id: string;
  word_lb: string;
}

export interface CachedLodEntry {
  lod_id: string;
  word_lb: string;
  en: string;
  fr: string;
  de: string;
  pt: string;
  ipa: string;
  emoji: string;
}

interface CategoryPage {
  items: GwsA1ListItem[];
  page_count: number;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`LOD fetch failed ${res.status}: ${url}`);
  }
  return (await res.json()) as T;
}

export async function fetchAllCategoryPages(
  categoryCode: string
): Promise<GwsA1ListItem[]> {
  const items: GwsA1ListItem[] = [];
  let page = 1;

  while (true) {
    const data = await fetchJson<CategoryPage>(
      `${LOD_API}/categories/${encodeURIComponent(categoryCode)}?page=${page}`
    );
    items.push(...data.items);
    if (page >= data.page_count) break;
    page++;
  }

  return items;
}

export async function fetchGwsA1List(): Promise<GwsA1ListItem[]> {
  return fetchAllCategoryPages("GWS A1");
}

function firstEn(en: string | undefined): string {
  if (!en?.trim()) return "";
  return en.split(";")[0].trim();
}

async function fetchEntryDetails(
  articleId: string
): Promise<CachedLodEntry | null> {
  const json = await fetchJson<unknown>(
    `${LOD_API}/entry/${encodeURIComponent(articleId)}`
  );
  const parsed = parseLodEntryResponse(
    json as Parameters<typeof parseLodEntryResponse>[0]
  );
  if (!parsed) return null;

  return {
    lod_id: parsed.lodId,
    word_lb: parsed.lemma,
    en: firstEn(parsed.translations.en) || parsed.lemma,
    fr: firstEn(parsed.translations.fr),
    de: firstEn(parsed.translations.de),
    pt: firstEn(parsed.translations.pt),
    ipa: parsed.ipa ?? "",
    emoji: "📝",
  };
}

async function mapWithConcurrency<T, R>(
  items: T[],
  concurrency: number,
  mapper: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < items.length) {
      const index = nextIndex++;
      results[index] = await mapper(items[index]!, index);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker())
  );
  return results;
}

export async function loadOrFetchGwsA1Entries(options?: {
  forceRefresh?: boolean;
  onProgress?: (done: number, total: number) => void;
}): Promise<Map<string, CachedLodEntry>> {
  if (!options?.forceRefresh && fs.existsSync(CACHE_FILE)) {
    const cached = JSON.parse(fs.readFileSync(CACHE_FILE, "utf-8")) as {
      entries: CachedLodEntry[];
    };
    return new Map(cached.entries.map((entry) => [entry.lod_id, entry]));
  }

  const list = await fetchGwsA1List();
  const uniqueIds = [...new Set(list.map((item) => item.article_id))];
  console.log(`Fetching ${uniqueIds.length} GWS A1 entries from LOD…`);

  let done = 0;
  const entries = await mapWithConcurrency(uniqueIds, 8, async (articleId) => {
    const entry = await fetchEntryDetails(articleId);
    done++;
    options?.onProgress?.(done, uniqueIds.length);
    if (done % 50 === 0 || done === uniqueIds.length) {
      console.log(`  ${done}/${uniqueIds.length} entries fetched`);
    }
    if (!entry) {
      const fallback = list.find((item) => item.article_id === articleId);
      return {
        lod_id: articleId,
        word_lb: fallback?.word_lb ?? articleId,
        en: fallback?.word_lb ?? articleId,
        fr: "",
        de: "",
        pt: "",
        ipa: "",
        emoji: "📝",
      };
    }
    return entry;
  });

  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
  fs.writeFileSync(
    CACHE_FILE,
    JSON.stringify({ fetchedAt: new Date().toISOString(), entries }, null, 0),
    "utf-8"
  );

  return new Map(entries.map((entry) => [entry.lod_id, entry]));
}
