import type { FillBlankVisual } from "@/types/lessonExercise";

export interface FillInBlankConfig {
  before: string;
  after: string;
  correctWord: string;
  bank: string[];
  fullSentence: string;
  englishHint: string;
  visual: FillBlankVisual;
  explain?: {
    highlightWord: string;
    meaning: string;
    examples: string[];
  };
}

export interface ChatDialogueConfig {
  prompt: string;
  promptTranslation: string;
  options: { id: string; text: string; translation: string }[];
  correctOptionId: string;
  explain?: {
    highlightWord: string;
    meaning: string;
    examples: string[];
  };
}

export interface TranslationSentenceConfig {
  source: string;
  answer: string[];
  distractors?: string[];
  explain?: {
    highlightWord: string;
    meaning: string;
    examples: string[];
  };
}
