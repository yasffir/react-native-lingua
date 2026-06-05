import { LOD_TRANSLATION_SENTENCES } from "@/data/lodTranslationSentences";
import type { TranslationSentenceConfig } from "@/types/exerciseContent";

export type { TranslationSentenceConfig } from "@/types/exerciseContent";

const HAND_CRAFTED_TRANSLATION_SENTENCES: Record<
  string,
  TranslationSentenceConfig[]
> = {
  "lu-lesson-1": [
    {
      source: "Moien!",
      answer: ["Hello"],
      distractors: ["Goodbye", "Please", "Tea", "Coffee"],
      explain: {
        highlightWord: "Moien",
        meaning: "Moien means hello in Luxembourgish — your everyday greeting.",
        examples: ["Moien!", "Moien, wéi geet et dir?"],
      },
    },
    {
      source: "Gudde Moien!",
      answer: ["Good", "morning"],
      distractors: ["Goodbye", "night", "evening", "please"],
      explain: {
        highlightWord: "Gudde Moien",
        meaning: "Gudde Moien means good morning.",
        examples: ["Gudde Moien!", "Moien an Gudde Moien"],
      },
    },
  ],
  "lu-lesson-5": [
    {
      source: "Moien, Kaffi oder Téi?",
      answer: ["Hello", "coffee", "or", "tea"],
      distractors: ["please", "bye", "with", "water", "bread"],
      explain: {
        highlightWord: "Kaffi",
        meaning: "Kaffi means coffee in Luxembourgish.",
        examples: ["Ech hätt gär e Kaffi.", "Kaffi, wann ech glift."],
      },
    },
    {
      source: "Ech hätt gär e Kaffi.",
      answer: ["I", "would", "like", "a", "coffee"],
      distractors: ["tea", "please", "water", "the", "bill"],
      explain: {
        highlightWord: "Kaffi",
        meaning: "Kaffi means coffee — common when ordering at a café.",
        examples: ["Moien, Kaffi oder Téi?", "Ech hätt gär e Kaffi, wann ech glift."],
      },
    },
  ],
};

export const LESSON_TRANSLATION_SENTENCES: Record<
  string,
  TranslationSentenceConfig[]
> = {
  ...LOD_TRANSLATION_SENTENCES,
  ...HAND_CRAFTED_TRANSLATION_SENTENCES,
};

export const COMMON_DISTRACTOR_WORDS = [
  "please",
  "bye",
  "with",
  "the",
  "and",
  "or",
  "a",
  "hello",
  "goodbye",
  "tea",
  "coffee",
  "water",
  "yes",
  "no",
];
