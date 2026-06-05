import type { LodEntrySummary, LodExample } from "@/lib/lod/types";

const LOD_BASE = "https://lod.lu";

interface ApiWordPart {
  type: string;
  content: string;
  joinWithPreviousWord?: boolean;
}

interface ApiExamplePart {
  type: string;
  parts?: ApiWordPart[];
}

interface ApiTranslationPart {
  type: string;
  content: string;
}

interface ApiMeaning {
  targetLanguages?: Record<
    string,
    { parts?: ApiTranslationPart[] }
  >;
  examples?: Array<{
    parts?: ApiExamplePart[];
    audioFiles?: { aac?: string };
  }>;
}

interface ApiEntryResponse {
  entry?: {
    lod_id: string;
    lemma: string;
    ipa?: string;
    partOfSpeechLabel?: string;
    audioFiles?: { aac?: string };
    microStructures?: Array<{
      grammaticalUnits?: Array<{
        meanings?: ApiMeaning[];
      }>;
    }>;
  };
}

function flattenTextParts(parts: ApiWordPart[]): string {
  let result = "";
  for (const part of parts) {
    if (part.joinWithPreviousWord) {
      result += part.content;
    } else {
      result += (result ? " " : "") + part.content;
    }
  }
  return result.replace(/\s+,/g, ",").replace(/\s+/g, " ").trim();
}

function extractExampleText(parts: ApiExamplePart[] | undefined): string {
  if (!parts?.length) return "";
  const textPart = parts.find((p) => p.type === "text");
  if (!textPart?.parts?.length) return "";
  return flattenTextParts(textPart.parts);
}

function firstTranslation(
  parts: ApiTranslationPart[] | undefined
): string | undefined {
  const hit = parts?.find((p) => p.type === "translation");
  return hit?.content?.trim() || undefined;
}

function collectExamples(entry: NonNullable<ApiEntryResponse["entry"]>): LodExample[] {
  const seen = new Set<string>();
  const examples: LodExample[] = [];

  for (const structure of entry.microStructures ?? []) {
    for (const unit of structure.grammaticalUnits ?? []) {
      for (const meaning of unit.meanings ?? []) {
        for (const example of meaning.examples ?? []) {
          const text = extractExampleText(example.parts);
          if (!text || seen.has(text)) continue;
          seen.add(text);
          examples.push({
            text,
            audioAac: example.audioFiles?.aac,
          });
        }
      }
    }
  }

  return examples;
}

function collectTranslations(
  entry: NonNullable<ApiEntryResponse["entry"]>
): LodEntrySummary["translations"] {
  const translations: LodEntrySummary["translations"] = {};

  for (const structure of entry.microStructures ?? []) {
    for (const unit of structure.grammaticalUnits ?? []) {
      for (const meaning of unit.meanings ?? []) {
        const langs = meaning.targetLanguages ?? {};
        for (const code of ["en", "fr", "de", "pt"] as const) {
          if (translations[code]) continue;
          const label = firstTranslation(langs[code]?.parts);
          if (label) translations[code] = label;
        }
      }
    }
  }

  return translations;
}

export function parseLodEntryResponse(
  json: ApiEntryResponse
): LodEntrySummary | null {
  const entry = json.entry;
  if (!entry?.lod_id || !entry.lemma) return null;

  const audioAac = entry.audioFiles?.aac;
  const resolvedAudio =
    audioAac && !audioAac.startsWith("http")
      ? `${LOD_BASE}${audioAac.startsWith("/") ? "" : "/"}${audioAac}`
      : audioAac;

  const examples = collectExamples(entry).map((ex) => ({
    ...ex,
    audioAac:
      ex.audioAac && !ex.audioAac.startsWith("http")
        ? `${LOD_BASE}${ex.audioAac.startsWith("/") ? "" : "/"}${ex.audioAac}`
        : ex.audioAac,
  }));

  return {
    lodId: entry.lod_id,
    lemma: entry.lemma,
    ipa: entry.ipa,
    partOfSpeech: entry.partOfSpeechLabel,
    audioAac: resolvedAudio,
    translations: collectTranslations(entry),
    examples,
    fetchedAt: Date.now(),
  };
}

export function parseWordOfTheDayResponse(json: {
  lod_id?: string;
  lemma?: string;
  start_at?: string;
}): import("@/lib/lod/types").LodWordOfTheDay | null {
  if (!json.lod_id || !json.lemma) return null;
  return {
    lodId: json.lod_id,
    lemma: json.lemma,
    startAt: json.start_at ?? "",
  };
}
