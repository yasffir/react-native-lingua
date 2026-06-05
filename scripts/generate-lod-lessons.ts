#!/usr/bin/env tsx
/**
 * Generate the full Luxembourgish GWS A1 curriculum from the live LOD API.
 *
 * Source: https://lod.lu/categories/category/GWS%20A1/1
 * ("Schwätzt Dir Lëtzebuergesch? – Niveau A1 (Wuertschatz)" — 867 words)
 *
 * Usage:
 *   npx tsx scripts/generate-lod-lessons.ts
 *   npx tsx scripts/generate-lod-lessons.ts --refresh-cache
 */
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

import {
  CATEGORY_ORDER,
  type LessonPlan,
  assignGwsA1Words,
  buildLessonPlans,
} from "./lib/gwsA1Plan";
import {
  fetchAllCategoryPages,
  fetchGwsA1List,
  loadOrFetchGwsA1Entries,
  type CachedLodEntry,
} from "./lib/lodCatalog";

const OUT_DIR = path.resolve(__dirname, "..", "data");
const ROOT_DIR = path.resolve(__dirname, "..");

const HAND_CRAFTED_AUDIO_IDS = [
  "MOIEN1",
  "ADDI1",
  "MERCI1",
  "KAFFI1",
  "TEI1",
  "WAASSER2",
  "BROUT1",
  "KUCH1",
  "MELLECH1",
  "PARDON1",
  "NUMM1",
  "GUTT2",
  "ZOCKER1",
];

const CATEGORY_EMOJI: Record<string, string> = {
  IESSEN: "🍽️",
  GEDRENKS: "🥤",
  FAMILL: "👨‍👩‍👧‍👦",
  PERSOUN: "🧑",
  FAARF: "🎨",
  MOUNT: "📅",
  METEO: "🌤️",
  WIEDER: "🌦️",
  SCHOUL: "🏫",
  UEBST: "🍎",
  GEMEIS: "🥬",
  DEIER: "🐾",
  ANAT: "🫀",
  PLANTE: "🌿",
  FESCH: "🐟",
  BLUMM: "🌸",
  GEFIER: "🚗",
  SPORT: "⚽",
  FEIERDEEG: "🎉",
  FEST: "🎊",
  MOOSSEENHEET: "📏",
  BERUFFSBEZEECHNUNG: "💼",
  MED: "🏥",
  KLEESCHEN: "⛪",
  CORE: "📖",
};

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function getEmoji(en: string, categoryCode: string): string {
  const lower = en.toLowerCase();
  const quick: Record<string, string> = {
    hello: "👋",
    goodbye: "👋",
    coffee: "☕",
    tea: "🍵",
    water: "💧",
    bread: "🍞",
    milk: "🥛",
    cat: "🐈",
    dog: "🐕",
    car: "🚗",
    bus: "🚌",
    apple: "🍎",
    banana: "🍌",
    red: "🔴",
    blue: "🔵",
    green: "🟢",
    mother: "👩",
    father: "👨",
    work: "💼",
    doctor: "👨‍⚕️",
  };
  for (const [key, emoji] of Object.entries(quick)) {
    if (lower.includes(key)) return emoji;
  }
  return CATEGORY_EMOJI[categoryCode] ?? "📝";
}

function enrichWord(
  planned: LessonPlan["words"][number],
  entry: CachedLodEntry | undefined
) {
  const en = entry?.en || planned.word_lb;
  return {
    lod_id: planned.lod_id,
    word_lb: entry?.word_lb || planned.word_lb,
    en,
    fr: entry?.fr ?? "",
    de: entry?.de ?? "",
    pt: entry?.pt ?? "",
    ipa: entry?.ipa ?? "",
    emoji: getEmoji(en, planned.categoryCode),
  };
}

function genVocab(w: ReturnType<typeof enrichWord>): string {
  const lines = [
    `      {`,
    `        word: "${escapeStr(w.word_lb)}",`,
    `        translation: "${escapeStr(w.en)}",`,
    `        pronunciation: "${escapeStr(w.ipa)}",`,
    `        emoji: "${escapeStr(w.emoji)}",`,
    `        audioId: "${escapeStr(w.lod_id)}",`,
  ];
  const trParts = [`en: "${escapeStr(w.en)}"`];
  if (w.fr) trParts.push(`fr: "${escapeStr(w.fr)}"`);
  if (w.de) trParts.push(`de: "${escapeStr(w.de)}"`);
  if (w.pt) trParts.push(`pt: "${escapeStr(w.pt)}"`);
  lines.push(`        translations: { ${trParts.join(", ")} },`);
  lines.push(`      }`);
  return lines.join("\n");
}

function genAiPrompt(lesson: LessonPlan, words: ReturnType<typeof enrichWord>[]): string {
  const wordList = words.map((w) => w.word_lb).join(", ");
  const topicStr = lesson.topics.join(", ");
  const titlePart = lesson.title.split(" — ")[0];
  return [
    `    aiTeacherPrompt: {`,
    `      systemPrompt:`,
    `        "${escapeStr(
      `You're Luna, a warm and energetic Luxembourgish coach in a real voice conversation about ${titlePart.toLowerCase()} (${topicStr}). Speak mostly in English — use contractions, sound natural and encouraging, not robotic. This is interactive: listen to what the student actually says, adapt your next line, and invite them to repeat or try again. When you introduce a Luxembourgish word, say it slowly once, give the English meaning, and one quick pronunciation tip — then stop and wait. Keep every reply to one or two short sentences. Your turn ends at the question mark — never role-play the student's answer or praise before they've spoken. Stay strictly within this lesson only (${topicStr}). Never teach other languages or off-topic vocabulary. Allowed words and phrases: ${wordList}.`
    )}",`,
    `      introMessage:`,
    `        "${escapeStr(
      `Hey! I'm Luna, your Luxembourgish coach — today we're learning ${titlePart.toLowerCase()} vocabulary from the official A1 word list. Ready to give it a try?`
    )}",`,
    `      topics: [${lesson.topics.map((t) => `"${escapeStr(t)}"`).join(", ")}],`,
    `    }`,
  ].join("\n");
}

function genLesson(
  lesson: LessonPlan,
  words: ReturnType<typeof enrichWord>[]
): string {
  return [
    `  {`,
    `    id: "${lesson.id}",`,
    `    unitId: "${lesson.unitId}",`,
    `    title: "${escapeStr(lesson.title)}",`,
    `    description: "${escapeStr(lesson.description)}",`,
    `    icon: "${escapeStr(lesson.icon)}",`,
    `    xpReward: 10,`,
    `    goals: [`,
    `      { description: "Learn ${words.length} vocabulary words", xpReward: 5 },`,
    `      { description: "Complete all exercises", xpReward: 5 },`,
    `    ],`,
    `    vocabulary: [`,
    words.map(genVocab).join(",\n"),
    `    ],`,
    `    phrases: [],`,
    `    activities: [],`,
    genAiPrompt(lesson, words),
    `  }`,
  ].join("\n");
}

function genUnit(unit: { id: string; title: string; description: string; order: number }, lessonIds: string[]): string {
  return [
    `  {`,
    `    id: "${unit.id}",`,
    `    languageCode: "lu",`,
    `    title: "${escapeStr(unit.title)}",`,
    `    description: "${escapeStr(unit.description)}",`,
    `    order: ${unit.order},`,
    `    lessonIds: [`,
    lessonIds.map((id) => `      "${id}"`).join(",\n"),
    `    ],`,
    `  }`,
  ].join("\n");
}

function genMatchingPairs(
  lesson: LessonPlan,
  words: ReturnType<typeof enrichWord>[]
): string {
  const pairs = words.slice(0, 5);
  if (pairs.length < 3) return "";
  return [
    `  "${lesson.id}": [`,
    `    [`,
    pairs
      .map((w) => {
        const extras: string[] = [];
        if (w.fr) extras.push(`fr: "${escapeStr(w.fr)}"`);
        if (w.de) extras.push(`de: "${escapeStr(w.de)}"`);
        if (w.pt) extras.push(`pt: "${escapeStr(w.pt)}"`);
        const extraStr = extras.length > 0 ? `, ${extras.join(", ")}` : "";
        return `      { english: "${escapeStr(w.en)}", luxembourgish: "${escapeStr(w.word_lb)}"${extraStr} }`;
      })
      .join(",\n"),
    `    ],`,
    `  ]`,
  ].join("\n");
}

async function main() {
  const forceRefresh = process.argv.includes("--refresh-cache");

  console.log("Loading GWS A1 word list from LOD…");
  const gwsList = await fetchGwsA1List();
  console.log(`  ${gwsList.length} list entries`);

  console.log("Loading thematic category memberships…");
  const categoryMembers = new Map<string, Set<string>>();
  for (const category of CATEGORY_ORDER) {
    const items = await fetchAllCategoryPages(category.code);
    categoryMembers.set(
      category.code,
      new Set(items.map((item) => item.article_id))
    );
  }

  const assignment = assignGwsA1Words(gwsList, categoryMembers);
  console.log(
    `  Assigned ${assignment.size} words to themes; ${gwsList.length - assignment.size} go to A1 Core`
  );

  const entryMap = await loadOrFetchGwsA1Entries({ forceRefresh });
  const { units, lessons } = buildLessonPlans(gwsList, assignment);

  const lessonBlocks: string[] = [];
  const pairsBlocks: string[] = [];
  const unitLessonIds: Record<string, string[]> = {};

  for (const lesson of lessons) {
    const words = lesson.words.map((planned) =>
      enrichWord(planned, entryMap.get(planned.lod_id))
    );
    lessonBlocks.push(genLesson(lesson, words));
    const pairs = genMatchingPairs(lesson, words);
    if (pairs) pairsBlocks.push(pairs);
    unitLessonIds[lesson.unitId] ??= [];
    unitLessonIds[lesson.unitId]!.push(lesson.id);
  }

  const lessonsFile = [
    `import { Lesson } from "@/types/learning";`,
    ``,
    `/** Generated from LOD GWS A1 — https://lod.lu/categories/category/GWS%20A1/1 */`,
    `export const LOD_LESSONS: Lesson[] = [`,
    lessonBlocks.join(",\n\n"),
    `];`,
    ``,
  ].join("\n");

  const unitsFile = [
    `import { Unit } from "@/types/learning";`,
    ``,
    `/** Generated from LOD GWS A1 thematic grouping + core vocabulary unit. */`,
    `export const LOD_UNITS: Unit[] = [`,
    units
      .map((unit) => genUnit(unit, unitLessonIds[unit.id] ?? []))
      .join(",\n\n"),
    `];`,
    ``,
  ].join("\n");

  const pairsFile = [
    `import type { MatchingPairConfig } from "./matchingPairs";`,
    ``,
    `export const LOD_MATCHING_PAIRS: Record<string, MatchingPairConfig[][]> = {`,
    pairsBlocks.join(",\n\n"),
    `};`,
    ``,
  ].join("\n");

  const audioMapFile = [
    `/** Bundled audio for Unit 1 hand-crafted lessons. LOD lessons stream via audioId + LOD cache. */`,
    `export const AUDIO_FILES: Record<string, any> = {`,
    HAND_CRAFTED_AUDIO_IDS.map(
      (id) => `  "${id}": require("@/assets/audio/${id}.mp3")`
    ).join(",\n"),
    `};`,
    ``,
  ].join("\n");

  fs.writeFileSync(path.join(OUT_DIR, "lodLessons.ts"), lessonsFile, "utf-8");
  fs.writeFileSync(path.join(OUT_DIR, "lodUnits.ts"), unitsFile, "utf-8");
  fs.writeFileSync(path.join(OUT_DIR, "lodMatchingPairs.ts"), pairsFile, "utf-8");
  fs.writeFileSync(path.join(OUT_DIR, "audioMap.ts"), audioMapFile, "utf-8");

  const searchRows = [...entryMap.values()].map((entry) => ({
    id: entry.lod_id,
    lb: entry.word_lb,
    en: entry.en,
    fr: entry.fr,
    de: entry.de,
    pt: entry.pt,
  }));
  const searchIndexFile = [
    `/** Auto-generated from GWS A1 LOD entries — EN/FR/DE/PT → LB dictionary search. */`,
    `export interface LodSearchIndexRow {`,
    `  id: string;`,
    `  lb: string;`,
    `  en: string;`,
    `  fr: string;`,
    `  de: string;`,
    `  pt: string;`,
    `}`,
    ``,
    `export const LOD_SEARCH_INDEX: LodSearchIndexRow[] = ${JSON.stringify(searchRows)};`,
    ``,
  ].join("\n");
  fs.writeFileSync(path.join(OUT_DIR, "lodSearchIndex.ts"), searchIndexFile, "utf-8");

  console.log(`\nWrote data/lodLessons.ts (${lessons.length} lessons)`);
  console.log(`Wrote data/lodUnits.ts (${units.length} units)`);
  console.log(`Wrote data/lodMatchingPairs.ts (${pairsBlocks.length} lessons)`);
  console.log(`Wrote data/audioMap.ts (${HAND_CRAFTED_AUDIO_IDS.length} bundled clips)`);
  console.log(`Wrote data/lodSearchIndex.ts (${searchRows.length} search rows)`);

  console.log("\nGenerating LOD exercise data…");
  execSync("npx tsx scripts/generate-lod-exercise-data.ts", {
    stdio: "inherit",
    cwd: ROOT_DIR,
  });

  console.log("\n═══ GWS A1 curriculum summary ═══");
  console.log(`Total LOD lessons: ${lessons.length} (+ 5 Unit 1 hand-crafted)`);
  console.log(`Total GWS A1 words covered: ${gwsList.length}`);
  for (const unit of units) {
    const ids = unitLessonIds[unit.id] ?? [];
    console.log(`  ${unit.title}: ${ids.length} lessons`);
  }
  console.log(
    "\nNext: bun run seed:supabase  (if using Supabase remote curriculum)"
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
