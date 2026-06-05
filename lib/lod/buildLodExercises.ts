import type {
  ChatDialogueConfig,
  FillInBlankConfig,
  TranslationSentenceConfig,
} from "@/types/exerciseContent";
import type { Lesson, VocabularyItem } from "@/types/learning";
import type { FillBlankVisual } from "@/types/lessonExercise";

const COMMON_TRANSLATE_DISTRACTORS = [
  "please",
  "bye",
  "hello",
  "yes",
  "no",
  "and",
  "or",
  "the",
  "goodbye",
  "thank you",
];

export function isLodLessonId(lessonId: string): boolean {
  const match = lessonId.match(/^lu-lesson-(\d+)$/);
  if (!match) return false;
  return parseInt(match[1], 10) >= 6;
}

function visualForUnit(unitId: string): FillBlankVisual {
  const map: Record<string, FillBlankVisual> = {
    "lu-unit-2": "cafe",
    "lu-unit-3": "introduction",
    "lu-unit-4": "numbers",
    "lu-unit-5": "person_cat",
    "lu-unit-6": "polite",
    "lu-unit-7": "introduction",
    "lu-unit-8": "greeting",
    "lu-unit-9": "greeting",
  };
  return map[unitId] ?? "greeting";
}

function pickDistractorWords(
  pool: VocabularyItem[],
  target: VocabularyItem,
  count: number
): VocabularyItem[] {
  return pool.filter((w) => w.word !== target.word).slice(0, count);
}

function englishLabel(translation: string): string {
  return translation.split("—")[0].trim().split(";")[0].trim();
}

function englishArticle(label: string): string {
  const first = label.trim().toLowerCase()[0];
  return first && "aeiou".includes(first) ? "an" : "a";
}

function tokenizeEnglish(translation: string): string[] {
  const clean = englishLabel(translation);
  return clean
    .replace(/[.,!?;:()]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const lower = word.toLowerCase();
      if (lower === "i") return "I";
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    });
}

/** Stable word-bank order so seed output is reproducible (runtime shuffle happens in builders). */
function buildWordBank(correct: string, distractors: string[]): string[] {
  return [correct, ...distractors].sort((a, b) => a.localeCompare(b, "lb"));
}

export function buildLodFillInBlankConfigs(
  lesson: Lesson
): FillInBlankConfig[] {
  const vocab = lesson.vocabulary;
  if (vocab.length < 4) return [];

  const visual = visualForUnit(lesson.unitId);
  const configs: FillInBlankConfig[] = [];

  const primary = vocab[0];
  const secondary = vocab[Math.min(2, vocab.length - 1)];
  const bank0 = buildWordBank(
    primary.word,
    pickDistractorWords(vocab, primary, 3).map((w) => w.word)
  );
  const en0 = englishLabel(primary.translation);

  configs.push({
    before: "Ech hätt gär e ",
    after: ".",
    correctWord: primary.word,
    bank: bank0,
    fullSentence: `Ech hätt gär e ${primary.word}.`,
    englishHint: `I would like ${englishArticle(en0)} ${en0.toLowerCase()}.`,
    visual,
    explain: {
      highlightWord: primary.word,
      meaning: `"${primary.word}" means "${en0}". The full sentence is: I would like ${englishArticle(en0)} ${en0.toLowerCase()}.`,
      examples: [`Ech hätt gär e ${primary.word}.`, primary.word],
    },
  });

  const bank1 = buildWordBank(
    secondary.word,
    pickDistractorWords(vocab, secondary, 3).map((w) => w.word)
  );
  const en1 = englishLabel(secondary.translation);

  configs.push({
    before: "Dat ass ",
    after: ".",
    correctWord: secondary.word,
    bank: bank1,
    fullSentence: `Dat ass ${secondary.word}.`,
    englishHint: `That is ${en1.toLowerCase()}.`,
    visual,
    explain: {
      highlightWord: secondary.word,
      meaning: `"${secondary.word}" means "${en1}". Dat ass … = That is …`,
      examples: [`Dat ass ${secondary.word}.`, secondary.word],
    },
  });

  return configs;
}

export function buildLodChatDialogues(lesson: Lesson): ChatDialogueConfig[] {
  const vocab = lesson.vocabulary;
  if (vocab.length < 2) return [];

  const dialogues: ChatDialogueConfig[] = [];
  const targets = [vocab[0], vocab[Math.min(1, vocab.length - 1)]];

  for (const target of targets) {
    const distractor =
      pickDistractorWords(vocab, target, 1)[0] ?? vocab[1];
    const en = englishLabel(target.translation);
    const distEn = englishLabel(distractor.translation);

    dialogues.push({
      prompt: `Wat ass dat?`,
      promptTranslation: "What is that?",
      options: [
        {
          id: "a",
          text: `Et ass ${target.word}.`,
          translation: `It is ${en.toLowerCase()}.`,
        },
        {
          id: "b",
          text: `Et ass ${distractor.word}.`,
          translation: `It is ${distEn.toLowerCase()}.`,
        },
      ],
      correctOptionId: "a",
      explain: {
        highlightWord: target.word,
        meaning: `When asked "Wat ass dat?", answer with Et ass ${target.word} (${en}).`,
        examples: ["Wat ass dat?", `Et ass ${target.word}.`],
      },
    });
  }

  return dialogues;
}

export function buildLodTranslationSentences(
  lesson: Lesson
): TranslationSentenceConfig[] {
  const vocab = lesson.vocabulary;
  if (vocab.length < 2) return [];

  const sentences: TranslationSentenceConfig[] = [];
  const indices = [0, 2, 4].filter((i) => i < vocab.length);

  for (const index of indices) {
    const target = vocab[index];
    const answer = tokenizeEnglish(target.translation);
    if (answer.length === 0 || answer.length > 6) continue;

    const distractorEn = pickDistractorWords(vocab, target, 4).map((w) =>
      englishLabel(w.translation)
    );

    sentences.push({
      source: target.word,
      answer,
      distractors: [
        ...distractorEn,
        ...COMMON_TRANSLATE_DISTRACTORS,
      ].slice(0, 6),
      explain: {
        highlightWord: target.word,
        meaning: `"${target.word}" means "${englishLabel(target.translation)}" in English.`,
        examples: [target.word, `${target.word}!`],
      },
    });
  }

  return sentences;
}
