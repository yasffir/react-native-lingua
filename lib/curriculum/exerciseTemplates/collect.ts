import { LESSON_CHAT_DIALOGUES } from "@/data/chatDialogues";
import { LESSON_FILL_IN_BLANK } from "@/data/fillInBlank";
import { LESSON_MATCHING_PAIRS } from "@/data/matchingPairs";
import { LESSON_TRANSLATION_SENTENCES } from "@/data/translationSentences";
import { LESSONS } from "@/data/lessons";
import { phraseToTranslationConfig } from "@/lib/lessonExercises/buildTranslationSteps";
import type {
  ExerciseStepTemplate,
  VocabDerivedTemplateConfig,
} from "@/types/exerciseTemplate";

const DEFAULT_VOCAB_DERIVED: VocabDerivedTemplateConfig = {
  maxPicture: 3,
  maxSelect: 4,
  maxFlashcard: 3,
};

let cachedAll: ExerciseStepTemplate[] | null = null;

/** Clear in-memory cache (e.g. after regenerating LOD exercise data in dev). */
export function resetExerciseTemplateCache(): void {
  cachedAll = null;
}

/** Collect every exercise template from bundled data (used for seed + local fallback). */
export function collectAllExerciseTemplates(): ExerciseStepTemplate[] {
  if (cachedAll) return cachedAll;

  const templates: ExerciseStepTemplate[] = [];

  for (const [lessonId, configs] of Object.entries(LESSON_FILL_IN_BLANK)) {
    configs.forEach((config, index) => {
      templates.push({
        id: `${lessonId}-fill-${index}`,
        lessonId,
        stepType: "fill_in_blank",
        sortOrder: index,
        config,
      });
    });
  }

  for (const [lessonId, dialogues] of Object.entries(LESSON_CHAT_DIALOGUES)) {
    dialogues.forEach((config, index) => {
      templates.push({
        id: `${lessonId}-chat-${index}`,
        lessonId,
        stepType: "complete_chat",
        sortOrder: 50 + index,
        config,
      });
    });
  }

  for (const [lessonId, sentences] of Object.entries(
    LESSON_TRANSLATION_SENTENCES
  )) {
    sentences.forEach((config, index) => {
      templates.push({
        id: `${lessonId}-translate-script-${index}`,
        lessonId,
        stepType: "translate",
        sortOrder: 60 + index,
        config,
      });
    });
  }

  for (const lesson of LESSONS) {
    lesson.phrases.forEach((phrase, index) => {
      const config = phraseToTranslationConfig(phrase);
      if (!config) return;
      templates.push({
        id: `${lesson.id}-translate-phrase-${index}`,
        lessonId: lesson.id,
        stepType: "translate",
        sortOrder: 70 + index,
        config,
      });
    });
  }

  for (const [lessonId, sets] of Object.entries(LESSON_MATCHING_PAIRS)) {
    sets.forEach((pairs, index) => {
      templates.push({
        id: `${lessonId}-match-${index}`,
        lessonId,
        stepType: "matching_pairs",
        sortOrder: 80 + index,
        config: { pairs },
      });
    });
  }

  for (const lesson of LESSONS) {
    if (lesson.vocabulary.length > 0) {
      templates.push({
        id: `${lesson.id}-vocab-derived`,
        lessonId: lesson.id,
        stepType: "vocab_derived",
        sortOrder: 1000,
        config: DEFAULT_VOCAB_DERIVED,
      });
    }
  }

  cachedAll = templates;
  return templates;
}

export function collectTemplatesForLesson(
  lessonId: string
): ExerciseStepTemplate[] {
  return collectAllExerciseTemplates().filter((t) => t.lessonId === lessonId);
}
