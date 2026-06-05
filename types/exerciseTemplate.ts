import type { ChatDialogueConfig } from "@/data/chatDialogues";
import type { FillInBlankConfig } from "@/data/fillInBlank";
import type { MatchingPairConfig } from "@/data/matchingPairs";
import type { TranslationSentenceConfig } from "@/data/translationSentences";

export type ExerciseTemplateType =
  | "fill_in_blank"
  | "complete_chat"
  | "translate"
  | "matching_pairs"
  | "vocab_derived";

export interface VocabDerivedTemplateConfig {
  maxPicture?: number;
  maxSelect?: number;
  maxFlashcard?: number;
  maxTranslate?: number;
  maxChat?: number;
}

export interface MatchingPairsTemplateConfig {
  pairs: MatchingPairConfig[];
}

export type ExerciseTemplateConfig =
  | FillInBlankConfig
  | ChatDialogueConfig
  | TranslationSentenceConfig
  | MatchingPairsTemplateConfig
  | VocabDerivedTemplateConfig;

export interface ExerciseStepTemplate {
  id: string;
  lessonId: string;
  stepType: ExerciseTemplateType;
  sortOrder: number;
  config: ExerciseTemplateConfig;
}
