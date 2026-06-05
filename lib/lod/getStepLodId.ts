import type { LessonExerciseStep } from "@/types/lessonExercise";
import type { VocabularyItem } from "@/types/learning";

function vocabAudioId(
  vocabulary: VocabularyItem[] | undefined,
  word: string | undefined
): string | undefined {
  if (!word || !vocabulary?.length) return undefined;
  const match = vocabulary.find(
    (v) => v.word === word || v.word.toLowerCase() === word.toLowerCase()
  );
  return match?.audioId;
}

/** Resolve LOD entry id from an exercise step (audioId doubles as lod_id). */
export function getStepLodId(
  step: LessonExerciseStep,
  vocabulary?: VocabularyItem[]
): string | undefined {
  if ("audioId" in step && step.audioId) {
    return step.audioId;
  }

  if (step.type === "fill_in_blank") {
    return (
      vocabAudioId(vocabulary, step.explain.highlightWord) ??
      vocabAudioId(vocabulary, step.correctOptionId)
    );
  }

  if (step.type === "picture_match") {
    return vocabAudioId(vocabulary, step.promptWord);
  }

  if (step.type === "matching_pairs") {
    const first = step.pairs[0];
    return vocabAudioId(vocabulary, first?.luxembourgish);
  }

  return undefined;
}
