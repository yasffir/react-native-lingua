import type { Lesson, VocabularyItem } from "@/types/learning";
import type {
  PictureMatchOption,
  PictureMatchStep,
  VocabIllustrationKey,
} from "@/types/pictureMatch";

const ILLUSTRATION_BY_TRANSLATION: Record<string, VocabIllustrationKey> = {
  coffee: "coffee",
  tea: "tea",
  milk: "milk",
  sugar: "sugar",
  water: "water",
  bread: "bread",
  cake: "cake",
  hello: "emoji",
  goodbye: "emoji",
  "good morning": "emoji",
  "good evening": "emoji",
  "good night": "emoji",
};

function illustrationFor(item: VocabularyItem): VocabIllustrationKey {
  const key = item.translation.trim().toLowerCase();
  return ILLUSTRATION_BY_TRANSLATION[key] ?? "emoji";
}

function toOption(item: VocabularyItem): PictureMatchOption {
  return {
    id: item.word,
    label: item.translation,
    illustration: illustrationFor(item),
    emoji: item.emoji,
  };
}

import { shuffle } from "@/lib/lessonExercises/shuffle";

function pickDistractors(
  pool: VocabularyItem[],
  correct: VocabularyItem,
  count: number
): VocabularyItem[] {
  const others = pool.filter((v) => v.word !== correct.word);
  return shuffle(others).slice(0, count);
}

/** One “select the correct image” step per vocabulary word (needs ≥ 4 words). */
export function buildPictureMatchSteps(lesson: Lesson): PictureMatchStep[] {
  const vocab = lesson.vocabulary;
  if (vocab.length < 4) return [];

  return vocab.map((target) => {
    const distractors = pickDistractors(vocab, target, 3);
    const options = shuffle([target, ...distractors]).map(toOption);
    return {
      id: `${lesson.id}-${target.word}`,
      promptWord: target.word,
      promptTranslation: target.translation,
      correctOptionId: target.word,
      options,
    };
  });
}
