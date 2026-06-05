import { LOD_SEARCH_INDEX } from "@/data/lodSearchIndex";
import type { LodSearchHit } from "@/lib/lod/types";
import type { TranslationLanguage } from "@/types/learning";

const MAX_RESULTS = 25;

function scoreMatch(text: string | undefined, query: string): number {
  if (!text) return 0;
  const value = text.toLowerCase().trim();
  const q = query.toLowerCase().trim();
  if (!value || !q) return 0;
  if (value === q) return 100;
  if (value.startsWith(q)) return 80;
  if (value.split(/\s+/).some((word) => word.startsWith(q))) return 70;
  if (value.includes(q)) return 55;
  return 0;
}

function translationForRow(
  row: (typeof LOD_SEARCH_INDEX)[number],
  lang: TranslationLanguage
): string {
  if (lang === "fr") return row.fr;
  if (lang === "de") return row.de;
  if (lang === "pt") return row.pt;
  return row.en;
}

/** Search bundled GWS A1 index by Luxembourgish or translation text. */
export function searchLocalLodIndex(
  query: string,
  translationLang: TranslationLanguage = "en"
): LodSearchHit[] {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  const ranked: Array<{ hit: LodSearchHit; score: number }> = [];

  for (const row of LOD_SEARCH_INDEX) {
    const lbScore = scoreMatch(row.lb, trimmed);
    const preferredScore = scoreMatch(
      translationForRow(row, translationLang),
      trimmed
    );
    const enScore = scoreMatch(row.en, trimmed);
    const score = Math.max(lbScore, preferredScore, enScore);
    if (score === 0) continue;

    ranked.push({
      score,
      hit: {
        lodId: row.id,
        lemma: row.lb,
        englishHint: row.en || undefined,
        matchedVia:
          lbScore >= preferredScore && lbScore >= enScore
            ? "lb"
            : preferredScore >= enScore
              ? translationLang
              : "en",
      },
    });
  }

  ranked.sort((a, b) => b.score - a.score || a.hit.lemma.localeCompare(b.hit.lemma, "lb"));

  return ranked.slice(0, MAX_RESULTS).map((item) => item.hit);
}

export function mergeSearchHits(
  primary: LodSearchHit[],
  secondary: LodSearchHit[]
): LodSearchHit[] {
  const merged = new Map<string, LodSearchHit>();

  for (const hit of [...primary, ...secondary]) {
    const existing = merged.get(hit.lodId);
    if (!existing) {
      merged.set(hit.lodId, hit);
      continue;
    }
    merged.set(hit.lodId, {
      ...existing,
      partOfSpeech: existing.partOfSpeech ?? hit.partOfSpeech,
      englishHint: existing.englishHint ?? hit.englishHint,
      matchedVia: existing.matchedVia ?? hit.matchedVia,
    });
  }

  return [...merged.values()];
}
