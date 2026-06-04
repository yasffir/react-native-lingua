/** “Complete the chat” prompts and reply options per lesson. */
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

export const LESSON_CHAT_DIALOGUES: Record<string, ChatDialogueConfig[]> = {
  "lu-lesson-1": [
    {
      prompt: "Moien! Wéi geet et dir?",
      promptTranslation: "Hello! How are you?",
      options: [
        { id: "a", text: "Et geet mir gutt, merci.", translation: "I am fine, thank you." },
        { id: "b", text: "Äddi!", translation: "Goodbye!" },
      ],
      correctOptionId: "a",
      explain: {
        highlightWord: "Wéi geet et dir?",
        meaning: "When someone asks how you are, answer with Et geet mir gutt, merci.",
        examples: ["Moien! Wéi geet et dir?", "Et geet mir gutt, merci."],
      },
    },
    {
      prompt: "Et freet mech.",
      promptTranslation: "Nice to meet you.",
      options: [
        { id: "a", text: "Et freet mech och.", translation: "Nice to meet you too." },
        { id: "b", text: "Gutt Nuecht!", translation: "Good night!" },
      ],
      correctOptionId: "a",
      explain: {
        highlightWord: "Et freet mech",
        meaning: "A polite reply when meeting someone is Et freet mech och.",
        examples: ["Et freet mech.", "Et freet mech och."],
      },
    },
  ],
  "lu-lesson-2": [
    {
      prompt: "Wéi heescht Dir?",
      promptTranslation: "What is your name?",
      options: [
        { id: "a", text: "Ech heeschen Marie.", translation: "My name is Marie." },
        { id: "b", text: "Moien!", translation: "Hello!" },
      ],
      correctOptionId: "a",
      explain: {
        highlightWord: "Wéi heescht Dir?",
        meaning: "Answer with Ech heeschen and your name.",
        examples: ["Wéi heescht Dir?", "Ech heeschen Marie."],
      },
    },
  ],
  "lu-lesson-3": [
    {
      prompt: "Wéi vill sinn et?",
      promptTranslation: "How many are there?",
      options: [
        { id: "a", text: "Et sinn fënnef.", translation: "There are five." },
        { id: "b", text: "Moien!", translation: "Hello!" },
      ],
      correctOptionId: "a",
      explain: {
        highlightWord: "Et sinn fënnef",
        meaning: "Answer the count with Et sinn and the number.",
        examples: ["Wéi vill sinn et?", "Et sinn fënnef."],
      },
    },
  ],
  "lu-lesson-4": [
    {
      prompt: "Merci!",
      promptTranslation: "Thank you!",
      options: [
        { id: "a", text: "Merci villmools!", translation: "Thank you very much!" },
        { id: "b", text: "Pardon!", translation: "Sorry!" },
      ],
      correctOptionId: "a",
      explain: {
        highlightWord: "Merci villmools",
        meaning: "A warm reply to thanks is Merci villmools (thank you very much).",
        examples: ["Merci!", "Merci villmools!"],
      },
    },
  ],
  "lu-lesson-5": [
    {
      prompt: "Téi oder Kaffi?",
      promptTranslation: "Tea or coffee?",
      options: [
        { id: "a", text: "Moien!", translation: "Hello!" },
        { id: "b", text: "Téi, bitte!", translation: "Tea, please!" },
      ],
      correctOptionId: "b",
      explain: {
        highlightWord: "Téi, bitte!",
        meaning: "When offered a drink, choose what you want and add bitte (please).",
        examples: ["Téi oder Kaffi?", "Téi, bitte!", "Kaffi, wann ech glift."],
      },
    },
    {
      prompt: "Wat kascht dat?",
      promptTranslation: "How much does that cost?",
      options: [
        { id: "a", text: "Déi Rechnung, wann ech glift.", translation: "The bill, please." },
        { id: "b", text: "Ech hätt gär e Kaffi.", translation: "I would like a coffee." },
      ],
      correctOptionId: "a",
      explain: {
        highlightWord: "Déi Rechnung",
        meaning: "After asking the price, you might ask for the bill when you are ready to pay.",
        examples: ["Wat kascht dat?", "Déi Rechnung, wann ech glift."],
      },
    },
  ],
};
