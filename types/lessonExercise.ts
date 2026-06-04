import type { PictureMatchStep } from "@/types/pictureMatch";

export interface WordBankChip {
  id: string;
  text: string;
}

export interface TranslationExplain {
  highlightWord: string;
  meaning: string;
  examples: string[];
}

export interface IncorrectAnswerFeedback {
  correctAnswer: string;
  meaning: string;
}

export interface TranslationStep {
  id: string;
  sourceSentence: string;
  correctWords: string[];
  bank: WordBankChip[];
  explain: TranslationExplain;
}

export type PictureMatchExerciseStep = PictureMatchStep & {
  type: "picture_match";
};

export type TranslationExerciseStep = TranslationStep & {
  type: "translate";
};

export interface ChatReplyOption {
  id: string;
  text: string;
  translation: string;
}

export interface CompleteChatStep {
  id: string;
  prompt: string;
  promptTranslation: string;
  options: ChatReplyOption[];
  correctOptionId: string;
  explain: TranslationExplain;
}

export type CompleteChatExerciseStep = CompleteChatStep & {
  type: "complete_chat";
};

export interface SelectTranslationOption {
  id: string;
  text: string;
}

export interface SelectTranslationStep {
  id: string;
  englishPrompt: string;
  options: SelectTranslationOption[];
  correctOptionId: string;
  explain: TranslationExplain;
}

export type SelectTranslationExerciseStep = SelectTranslationStep & {
  type: "select_translation";
};

export interface FlashcardSpeakStep {
  id: string;
  luxembourgishWord: string;
  englishWord: string;
  pronunciation: string;
  explain: TranslationExplain;
}

export type FlashcardSpeakExerciseStep = FlashcardSpeakStep & {
  type: "flashcard_speak";
};

export type FillBlankVisual =
  | "greeting"
  | "cafe"
  | "introduction"
  | "numbers"
  | "polite"
  | "person_cat";

export interface FillInBlankOption {
  id: string;
  text: string;
}

export interface FillInBlankStep {
  id: string;
  before: string;
  after: string;
  correctOptionId: string;
  fullSentence: string;
  englishHint: string;
  visual: FillBlankVisual;
  options: FillInBlankOption[];
  explain: TranslationExplain;
}

export type FillInBlankExerciseStep = FillInBlankStep & {
  type: "fill_in_blank";
};

export interface MatchingPairsTile {
  tileId: string;
  pairId: string;
  text: string;
}

export interface MatchingPairEntry {
  pairId: string;
  english: string;
  luxembourgish: string;
}

export interface MatchingPairsStep {
  id: string;
  pairs: MatchingPairEntry[];
  leftTiles: MatchingPairsTile[];
  rightTiles: MatchingPairsTile[];
  explain: TranslationExplain;
}

export type MatchingPairsExerciseStep = MatchingPairsStep & {
  type: "matching_pairs";
};

export type LessonExerciseStep =
  | PictureMatchExerciseStep
  | TranslationExerciseStep
  | CompleteChatExerciseStep
  | SelectTranslationExerciseStep
  | FlashcardSpeakExerciseStep
  | FillInBlankExerciseStep
  | MatchingPairsExerciseStep;
