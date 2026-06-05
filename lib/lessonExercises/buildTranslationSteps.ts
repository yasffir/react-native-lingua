import {
  COMMON_DISTRACTOR_WORDS,
  LESSON_TRANSLATION_SENTENCES,
  type TranslationSentenceConfig,
} from "@/data/translationSentences";
import { shuffle } from "@/lib/lessonExercises/shuffle";
import type { Lesson, Phrase } from "@/types/learning";
import type {
  TranslationExerciseStep,
  TranslationExplain,
  WordBankChip,
} from "@/types/lessonExercise";

function tokenizeTranslation(text: string): string[] {
  return text
    .replace(/[.,!?;:]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === "i") return "I";
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    });
}

function defaultExplain(
  source: string,
  highlight: string
): TranslationExplain {
  return {
    highlightWord: highlight,
    meaning: `${highlight} is a Luxembourgish word or phrase from this lesson.`,
    examples: [`${source}`],
  };
}

function buildBank(
  correct: string[],
  distractors: string[]
): WordBankChip[] {
  const correctSet = new Set(correct.map((w) => w.toLowerCase()));
  const extra = distractors
    .filter((w) => !correctSet.has(w.toLowerCase()))
    .slice(0, 6);

  const chips: WordBankChip[] = [
    ...correct.map((text, index) => ({
      id: `c-${index}-${text}`,
      text,
    })),
    ...extra.map((text, index) => ({
      id: `d-${index}-${text}`,
      text,
    })),
  ];

  return shuffle(chips);
}

export function translationStepFromConfig(
  lessonId: string,
  config: TranslationSentenceConfig,
  index: number
): TranslationExerciseStep {
  const highlight =
    config.explain?.highlightWord ??
    config.source.replace(/[.,!?]/g, "").split(/\s+/)[0] ??
    config.source;

  return {
    type: "translate",
    id: `${lessonId}-translate-${index}`,
    sourceSentence: config.source,
    correctWords: config.answer,
    bank: buildBank(
      config.answer,
      config.distractors ?? COMMON_DISTRACTOR_WORDS
    ),
    explain:
      config.explain ?? defaultExplain(config.source, highlight),
  };
}

export function phraseToTranslationConfig(
  phrase: Phrase
): TranslationSentenceConfig | null {
  const answer = tokenizeTranslation(phrase.translation);
  if (answer.length < 2 || answer.length > 8) return null;

  const highlight = phrase.text.replace(/[.,!?]/g, "").split(/\s+/)[0];

  return {
    source: phrase.text,
    answer,
    explain: {
      highlightWord: highlight,
      meaning: `"${phrase.text}" means "${phrase.translation}" in English.`,
      examples: [phrase.text],
    },
  };
}

export function buildTranslationSteps(lesson: Lesson): TranslationExerciseStep[] {
  const scripted = LESSON_TRANSLATION_SENTENCES[lesson.id] ?? [];
  const fromPhrases = lesson.phrases
    .map(phraseToTranslationConfig)
    .filter((c): c is TranslationSentenceConfig => c !== null);

  const merged: TranslationSentenceConfig[] = [...scripted];
  for (const phraseConfig of fromPhrases) {
    const exists = merged.some((m) => m.source === phraseConfig.source);
    if (!exists) merged.push(phraseConfig);
  }

  const picked = shuffle(merged).slice(0, 3);

  return picked.map((config, index) =>
    translationStepFromConfig(lesson.id, config, index)
  );
}

export function normalizeWordList(words: string[]): string {
  return words
    .map((w) => w.toLowerCase().replace(/[.,!?]/g, ""))
    .join(" ");
}

export function isTranslationCorrect(
  selected: string[],
  correct: string[]
): boolean {
  return normalizeWordList(selected) === normalizeWordList(correct);
}
