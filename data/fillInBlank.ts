import type { FillBlankVisual } from "@/types/lessonExercise";

export interface FillInBlankConfig {
  /** Sentence split around the blank, e.g. ["Ech hunn e ", " an e Katz."] */
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

export const LESSON_FILL_IN_BLANK: Record<string, FillInBlankConfig[]> = {
  "lu-lesson-1": [
    {
      before: "",
      after: "! Wéi geet et dir?",
      correctWord: "Moien",
      bank: ["Moien", "Äddi", "Merci", "Jo"],
      fullSentence: "Moien! Wéi geet et dir?",
      englishHint: "Hello! How are you?",
      visual: "greeting",
    },
    {
      before: "Et geet mir gutt, ",
      after: ".",
      correctWord: "merci",
      bank: ["merci", "Moien", "Äddi", "Pardon"],
      fullSentence: "Et geet mir gutt, merci.",
      englishHint: "I am fine, thank you.",
      visual: "greeting",
    },
  ],
  "lu-lesson-2": [
    {
      before: "",
      after: " heeschen Marie.",
      correctWord: "Ech",
      bank: ["Ech", "Wéi", "Vu", "Moien"],
      fullSentence: "Ech heeschen Marie.",
      englishHint: "My name is Marie.",
      visual: "introduction",
    },
    {
      before: "e ",
      after: " an e Katz.",
      correctWord: "Mann",
      bank: ["e", "Jong", "Mann", "an"],
      fullSentence: "e Mann an e Katz.",
      englishHint: "a man and a cat",
      visual: "person_cat",
      explain: {
        highlightWord: "Mann",
        meaning:
          "Mann means man (adult male). Jong means boy — the picture shows a grown man with a cat.",
        examples: ["e Mann", "e Jong"],
      },
    },
  ],
  "lu-lesson-3": [
    {
      before: "Et sinn ",
      after: ".",
      correctWord: "fënnef",
      bank: ["fënnef", "dräi", "zéng", "zwee"],
      fullSentence: "Et sinn fënnef.",
      englishHint: "There are five.",
      visual: "numbers",
    },
  ],
  "lu-lesson-4": [
    {
      before: "",
      after: " villmools!",
      correctWord: "Merci",
      bank: ["Merci", "Pardon", "Jo", "Nee"],
      fullSentence: "Merci villmools!",
      englishHint: "Thank you very much!",
      visual: "polite",
    },
  ],
  "lu-lesson-5": [
    {
      before: "Ech hätt gär e ",
      after: ", wann ech glift.",
      correctWord: "Kaffi",
      bank: ["Kaffi", "Téi", "Waasser", "Brout"],
      fullSentence: "Ech hätt gär e Kaffi, wann ech glift.",
      englishHint: "I would like a coffee, please.",
      visual: "cafe",
    },
    {
      before: "Moien, ",
      after: " oder Téi?",
      correctWord: "Kaffi",
      bank: ["Kaffi", "Kuch", "Mëllech", "Moien"],
      fullSentence: "Moien, Kaffi oder Téi?",
      englishHint: "Hello, coffee or tea?",
      visual: "cafe",
    },
  ],
};
