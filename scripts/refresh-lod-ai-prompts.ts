#!/usr/bin/env tsx
/**
 * Refresh aiTeacherPrompt blocks in data/lodLessons.ts (prompt 16).
 * Does not require the external LOD dataset.
 */
import { writeFileSync } from "fs";
import path from "path";

import {
  buildAiTeacherIntroMessage,
  buildAiTeacherSystemPrompt,
} from "../data/lessons";
import { LOD_LESSONS } from "../data/lodLessons";
import type { Lesson } from "../types/learning";

const OUT = path.resolve(__dirname, "..", "data", "lodLessons.ts");

function escapeStr(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function allowedTerms(lesson: Lesson): string {
  return [
    ...lesson.vocabulary.map((item) => item.word),
    ...lesson.phrases.map((item) => item.text),
  ].join(", ");
}

function buildPrompt(lesson: Lesson) {
  const titlePart = lesson.title.split(" — ")[0];
  const topics = lesson.aiTeacherPrompt.topics;
  return {
    systemPrompt: buildAiTeacherSystemPrompt({
      lessonFocus: `${titlePart.toLowerCase()} (${topics.join(", ")})`,
      allowedTerms: allowedTerms(lesson),
      topics,
    }),
    introMessage: buildAiTeacherIntroMessage({
      hook: `today we're learning ${titlePart.toLowerCase()} vocabulary.`,
    }),
    topics,
  };
}

function genVocab(lesson: Lesson): string {
  return lesson.vocabulary
    .map((item) => {
      const lines = [
        "      {",
        `        word: "${escapeStr(item.word)}",`,
        `        translation: "${escapeStr(item.translation)}",`,
        `        pronunciation: "${escapeStr(item.pronunciation)}",`,
        `        emoji: "${escapeStr(item.emoji ?? "📘")}",`,
      ];
      if (item.audioId) {
        lines.push(`        audioId: "${escapeStr(item.audioId)}",`);
      }
      if (item.translations) {
        const parts = Object.entries(item.translations).map(
          ([code, label]) => `${code}: "${escapeStr(label)}"`
        );
        lines.push(`        translations: { ${parts.join(", ")} },`);
      }
      lines.push("      }");
      return lines.join("\n");
    })
    .join(",\n");
}

function genLesson(lesson: Lesson): string {
  const prompt = buildPrompt(lesson);
  const vocabCount = lesson.vocabulary.length;
  return [
    "  {",
    `    id: "${lesson.id}",`,
    `    unitId: "${lesson.unitId}",`,
    `    title: "${escapeStr(lesson.title)}",`,
    `    description: "${escapeStr(lesson.description)}",`,
    `    icon: "${escapeStr(lesson.icon)}",`,
    "    xpReward: 10,",
    "    goals: [",
    `      { description: "Learn ${vocabCount} vocabulary words", xpReward: 5 },`,
    `      { description: "Complete all exercises", xpReward: 5 },`,
    "    ],",
    "    vocabulary: [",
    genVocab(lesson),
    "    ],",
    "    phrases: [],",
    "    activities: [],",
    "    aiTeacherPrompt: {",
    "      systemPrompt:",
    `        "${escapeStr(prompt.systemPrompt)}",`,
    "      introMessage:",
    `        "${escapeStr(prompt.introMessage)}",`,
    `      topics: [${prompt.topics.map((t) => `"${escapeStr(t)}"`).join(", ")}],`,
    "    }",
    "  }",
  ].join("\n");
}

const file = [
  'import { Lesson } from "@/types/learning";',
  "",
  "export const LOD_LESSONS: Lesson[] = [",
  LOD_LESSONS.map(genLesson).join(",\n\n"),
  "];",
  "",
].join("\n");

writeFileSync(OUT, file, "utf8");
console.log(`Updated aiTeacherPrompt for ${LOD_LESSONS.length} LOD lessons.`);
