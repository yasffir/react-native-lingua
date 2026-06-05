#!/usr/bin/env tsx
/**
 * Generate LOD fill-in-blank, chat, and translate exercise data from lodLessons.
 * Run after generate-lod-lessons.ts, or standalone when only lessons changed.
 *
 * Usage: npx tsx scripts/generate-lod-exercise-data.ts
 */
import * as fs from "fs";
import * as path from "path";

import { LESSONS } from "../data/lessons";
import {
  buildLodChatDialogues,
  buildLodFillInBlankConfigs,
  buildLodTranslationSentences,
  isLodLessonId,
} from "../lib/lod/buildLodExercises";

const OUT_DIR = path.resolve(__dirname, "..", "data");

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

function fmtStringArray(arr: string[]): string {
  return `[${arr.map((s) => `"${escapeStr(s)}"`).join(", ")}]`;
}

function genFillEntry(lessonId: string, configs: ReturnType<typeof buildLodFillInBlankConfigs>): string {
  if (configs.length === 0) return "";
  const items = configs
    .map((c) => {
      const explain = c.explain
        ? `,
      explain: {
        highlightWord: "${escapeStr(c.explain.highlightWord)}",
        meaning: "${escapeStr(c.explain.meaning)}",
        examples: ${fmtStringArray(c.explain.examples)},
      }`
        : "";
      return `    {
      before: "${escapeStr(c.before)}",
      after: "${escapeStr(c.after)}",
      correctWord: "${escapeStr(c.correctWord)}",
      bank: ${fmtStringArray(c.bank)},
      fullSentence: "${escapeStr(c.fullSentence)}",
      englishHint: "${escapeStr(c.englishHint)}",
      visual: "${c.visual}"${explain},
    }`;
    })
    .join(",\n");
  return `  "${lessonId}": [\n${items}\n  ]`;
}

function genChatEntry(lessonId: string, dialogues: ReturnType<typeof buildLodChatDialogues>): string {
  if (dialogues.length === 0) return "";
  const items = dialogues
    .map((d) => {
      const opts = d.options
        .map(
          (o) =>
            `{ id: "${o.id}", text: "${escapeStr(o.text)}", translation: "${escapeStr(o.translation)}" }`
        )
        .join(", ");
      return `    {
      prompt: "${escapeStr(d.prompt)}",
      promptTranslation: "${escapeStr(d.promptTranslation)}",
      options: [${opts}],
      correctOptionId: "${d.correctOptionId}",
      explain: {
        highlightWord: "${escapeStr(d.explain?.highlightWord ?? "")}",
        meaning: "${escapeStr(d.explain?.meaning ?? "")}",
        examples: ${fmtStringArray(d.explain?.examples ?? [])},
      },
    }`;
    })
    .join(",\n");
  return `  "${lessonId}": [\n${items}\n  ]`;
}

function genTranslateEntry(
  lessonId: string,
  sentences: ReturnType<typeof buildLodTranslationSentences>
): string {
  if (sentences.length === 0) return "";
  const items = sentences
    .map((s) => {
      const dist = s.distractors ? `,\n      distractors: ${fmtStringArray(s.distractors)}` : "";
      return `    {
      source: "${escapeStr(s.source)}",
      answer: ${fmtStringArray(s.answer)}${dist},
      explain: {
        highlightWord: "${escapeStr(s.explain?.highlightWord ?? "")}",
        meaning: "${escapeStr(s.explain?.meaning ?? "")}",
        examples: ${fmtStringArray(s.explain?.examples ?? [])},
      },
    }`;
    })
    .join(",\n");
  return `  "${lessonId}": [\n${items}\n  ]`;
}

const lodLessons = LESSONS.filter((l) => isLodLessonId(l.id));

const fillEntries: string[] = [];
const chatEntries: string[] = [];
const translateEntries: string[] = [];

for (const lesson of lodLessons) {
  const fill = genFillEntry(lesson.id, buildLodFillInBlankConfigs(lesson));
  if (fill) fillEntries.push(fill);

  const chat = genChatEntry(lesson.id, buildLodChatDialogues(lesson));
  if (chat) chatEntries.push(chat);

  const translate = genTranslateEntry(
    lesson.id,
    buildLodTranslationSentences(lesson)
  );
  if (translate) translateEntries.push(translate);
}

const fillFile = [
  `import type { FillInBlankConfig } from "@/types/exerciseContent";`,
  ``,
  `export const LOD_FILL_IN_BLANK: Record<string, FillInBlankConfig[]> = {`,
  fillEntries.join(",\n\n"),
  `};`,
  ``,
].join("\n");

const chatFile = [
  `import type { ChatDialogueConfig } from "@/types/exerciseContent";`,
  ``,
  `export const LOD_CHAT_DIALOGUES: Record<string, ChatDialogueConfig[]> = {`,
  chatEntries.join(",\n\n"),
  `};`,
  ``,
].join("\n");

const translateFile = [
  `import type { TranslationSentenceConfig } from "@/types/exerciseContent";`,
  ``,
  `export const LOD_TRANSLATION_SENTENCES: Record<string, TranslationSentenceConfig[]> = {`,
  translateEntries.join(",\n\n"),
  `};`,
  ``,
].join("\n");

fs.writeFileSync(path.join(OUT_DIR, "lodFillInBlank.ts"), fillFile, "utf-8");
fs.writeFileSync(path.join(OUT_DIR, "lodChatDialogues.ts"), chatFile, "utf-8");
fs.writeFileSync(
  path.join(OUT_DIR, "lodTranslationSentences.ts"),
  translateFile,
  "utf-8"
);

console.log(
  `Wrote LOD exercises: ${fillEntries.length} fill-in-blank, ${chatEntries.length} chat, ${translateEntries.length} translate lessons`
);
