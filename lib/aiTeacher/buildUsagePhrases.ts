import type { LodEntrySummary } from "@/lib/lod/types";
import type { VocabularyItem } from "@/types/learning";

export interface UsagePhrase {
  scenario: string;
  luxembourgish: string;
  english?: string;
  audioAac?: string;
}

function englishLabel(translation: string): string {
  return translation.split("—")[0].trim().split(";")[0].trim();
}

function topicScenarioLabel(topics: string[] | undefined, index: number): string {
  const topic = topics?.[0]?.toLowerCase() ?? "";
  if (
    topic.includes("food") ||
    topic.includes("meal") ||
    topic.includes("drink") ||
    topic.includes("cook")
  ) {
    return index === 0 ? "At the café" : "Ordering";
  }
  if (topic.includes("family") || topic.includes("relation")) {
    return index === 0 ? "Talking about family" : "Introducing someone";
  }
  if (topic.includes("greet") || topic.includes("intro")) {
    return index === 0 ? "Meeting someone" : "Everyday chat";
  }
  if (topic.includes("number")) {
    return index === 0 ? "Counting" : "How many?";
  }
  return index === 0 ? "Everyday use" : "In context";
}

function fallbackPhrases(
  item: VocabularyItem,
  topics: string[] | undefined
): UsagePhrase[] {
  const en = englishLabel(item.translation);
  return [
    {
      scenario: topicScenarioLabel(topics, 0),
      luxembourgish: `Dat ass ${item.word}.`,
      english: `That is ${en}.`,
    },
    {
      scenario: topicScenarioLabel(topics, 1),
      luxembourgish: `Wat ass dat? — ${item.word}.`,
      english: `What is that? — ${en}.`,
    },
  ];
}

export function toVocabForUsage(
  word: string,
  translation: string,
  audioId?: string
): VocabularyItem {
  return { word, translation, pronunciation: "", audioId };
}

/** LOD examples first; simple scenario templates when offline or no examples. */
export function buildUsagePhrases(
  item: VocabularyItem | null,
  lodEntry: LodEntrySummary | null,
  topics?: string[],
  excludeTexts?: string[]
): UsagePhrase[] {
  if (!item) return [];

  const excluded = new Set(
    (excludeTexts ?? []).map((text) => text.trim().toLowerCase())
  );
  const lodExamples = (lodEntry?.examples ?? [])
    .filter((ex) => !excluded.has(ex.text.trim().toLowerCase()))
    .slice(0, 2);
  if (lodExamples.length > 0) {
    return lodExamples.map((example, index) => ({
      scenario: topicScenarioLabel(topics, index),
      luxembourgish: example.text,
      english:
        index === 0
          ? `Real sentence using “${item.word}”.`
          : `Another situation with “${item.word}”.`,
      audioAac: example.audioAac,
    }));
  }

  return fallbackPhrases(item, topics);
}
