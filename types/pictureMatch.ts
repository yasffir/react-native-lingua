export type VocabIllustrationKey =
  | "coffee"
  | "tea"
  | "milk"
  | "sugar"
  | "water"
  | "bread"
  | "cake"
  | "emoji";

export interface PictureMatchOption {
  id: string;
  label: string;
  illustration: VocabIllustrationKey;
  emoji?: string;
}

export interface PictureMatchStep {
  id: string;
  promptWord: string;
  promptTranslation: string;
  audioId?: string;
  options: PictureMatchOption[];
  correctOptionId: string;
}
