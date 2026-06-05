import type { LodSearchHit, LodSearchPage } from "@/lib/lod/types";

interface AdvancedSearchResponse {
  results?: Array<{
    id?: string;
    article_id?: string;
    word_lb?: string;
    pos?: string;
  }>;
  total_item_count?: number;
  page_count?: number;
  current_page?: number;
}

export function parseLodAdvancedSearchResponse(
  json: AdvancedSearchResponse
): LodSearchPage {
  const results: LodSearchHit[] = (json.results ?? [])
    .map((item) => {
      const lodId = item.article_id ?? item.id;
      if (!lodId || !item.word_lb) return null;
      return {
        lodId,
        lemma: item.word_lb,
        partOfSpeech: item.pos,
      };
    })
    .filter((item): item is LodSearchHit => Boolean(item));

  return {
    results,
    total: json.total_item_count ?? results.length,
    pageCount: json.page_count ?? (results.length > 0 ? 1 : 0),
    currentPage: json.current_page ?? 1,
  };
}
