export interface LodExample {
  text: string;
  audioAac?: string;
}

export interface LodEntrySummary {
  lodId: string;
  lemma: string;
  ipa?: string;
  partOfSpeech?: string;
  audioAac?: string;
  translations: {
    en?: string;
    fr?: string;
    de?: string;
    pt?: string;
  };
  examples: LodExample[];
  fetchedAt: number;
}

export interface LodWordOfTheDay {
  lodId: string;
  lemma: string;
  startAt: string;
}

export interface LodSearchHit {
  lodId: string;
  lemma: string;
  partOfSpeech?: string;
  /** English gloss for list rows (from local A1 index or entry). */
  englishHint?: string;
  matchedVia?: "lb" | "en" | "fr" | "de" | "pt";
}

export interface LodSearchPage {
  results: LodSearchHit[];
  total: number;
  pageCount: number;
  currentPage: number;
}

export interface LodRecentSearch {
  query: string;
  searchedAt: number;
}
