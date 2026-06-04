/** One matching-pairs round: English (left) ↔ Luxembourgish (right). */
export interface MatchingPairConfig {
  english: string;
  luxembourgish: string;
}

/** Per lesson, one or more sets (each set becomes one exercise step). */
export const LESSON_MATCHING_PAIRS: Record<string, MatchingPairConfig[][]> = {
  "lu-lesson-1": [
    [
      { english: "Hello", luxembourgish: "Moien" },
      { english: "Goodbye", luxembourgish: "Äddi" },
      { english: "Good morning", luxembourgish: "Gudde Moien" },
      { english: "Good night", luxembourgish: "Gutt Nuecht" },
      { english: "How are you?", luxembourgish: "Wéi geet et dir?" },
    ],
  ],
  "lu-lesson-2": [
    [
      { english: "and", luxembourgish: "an" },
      { english: "a", luxembourgish: "e" },
      { english: "man", luxembourgish: "Mann" },
      { english: "cat", luxembourgish: "Katz" },
      { english: "boy", luxembourgish: "Jong" },
    ],
    [
      { english: "My name is", luxembourgish: "Ech heeschen" },
      { english: "I am", luxembourgish: "Ech sinn" },
      { english: "Name", luxembourgish: "Numm" },
      { english: "From", luxembourgish: "Vu" },
      { english: "Pleased to meet you", luxembourgish: "Freet mech" },
    ],
  ],
  "lu-lesson-3": [
    [
      { english: "one", luxembourgish: "eent" },
      { english: "two", luxembourgish: "zwee" },
      { english: "three", luxembourgish: "dräi" },
      { english: "five", luxembourgish: "fënnef" },
      { english: "ten", luxembourgish: "zéng" },
    ],
  ],
  "lu-lesson-4": [
    [
      { english: "Thank you", luxembourgish: "Merci" },
      { english: "Please", luxembourgish: "wann ech glift" },
      { english: "Yes", luxembourgish: "Jo" },
      { english: "No", luxembourgish: "Nee" },
      { english: "Sorry", luxembourgish: "Pardon" },
    ],
  ],
  "lu-lesson-5": [
    [
      { english: "coffee", luxembourgish: "Kaffi" },
      { english: "tea", luxembourgish: "Téi" },
      { english: "milk", luxembourgish: "Mëllech" },
      { english: "sugar", luxembourgish: "Zuocker" },
      { english: "bread", luxembourgish: "Brout" },
    ],
  ],
};
