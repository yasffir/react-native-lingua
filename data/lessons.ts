import { Lesson } from "@/types/learning";
import { LOD_LESSONS } from "./lodLessons";

/** Shared Luna prompt copy for AI Teacher (prompt 16). */
export function buildAiTeacherSystemPrompt(options: {
  lessonFocus: string;
  allowedTerms: string;
  topics: string[];
}): string {
  const topicLabel = options.topics.join(", ");
  return (
    `You're Luna, a warm and energetic Luxembourgish coach in a real voice conversation about ${options.lessonFocus}. ` +
    `Speak mostly in English — use contractions, sound natural and encouraging, not robotic. ` +
    `This is interactive: listen to what the student actually says, adapt your next line, and invite them to repeat or try again. ` +
    `When you introduce a Luxembourgish word, say it slowly once, give the English meaning, and one quick pronunciation tip — then stop and wait. ` +
    `Keep every reply to one or two short sentences. Your turn ends at the question mark — never role-play the student's answer or praise before they've spoken. ` +
    `Stay strictly within this lesson only (${topicLabel}). Never teach other languages or off-topic vocabulary. ` +
    `Allowed words and phrases: ${options.allowedTerms}.`
  );
}

export function buildAiTeacherIntroMessage(options: { hook: string }): string {
  return `Hey! I'm Luna, your Luxembourgish coach — ${options.hook} Ready to give it a try?`;
}

function lessonAllowedTerms(
  vocabulary: { word: string }[],
  phrases: { text: string }[]
): string {
  return [...vocabulary.map((v) => v.word), ...phrases.map((p) => p.text)].join(
    ", "
  );
}

const HAND_CRAFTED: Lesson[] = [
  // ─── Luxembourgish ─────────────────────────────────────────────────────────

  {
    id: "lu-lesson-1",
    unitId: "lu-unit-1",
    title: "Moien! Greetings",
    description: "Learn how to say hello and goodbye in Luxembourgish",
    icon: "👋",
    xpReward: 10,
    goals: [
      { description: "Learn 5 greeting words", xpReward: 5 },
      { description: "Complete all activities", xpReward: 5 },
    ],
    vocabulary: [
      {
        word: "Moien",
        translation: "Hello",
        pronunciation: "MOY-en",
        emoji: "👋",
        audioId: "MOIEN1",
      },
      {
        word: "Äddi",
        translation: "Goodbye",
        pronunciation: "AH-dee",
        emoji: "👋",
        audioId: "ADDI1",
      },
      {
        word: "Gudde Moien",
        translation: "Good morning",
        pronunciation: "GOO-de MOY-en",
        emoji: "🌅",
      },
      {
        word: "Gudden Owend",
        translation: "Good evening",
        pronunciation: "GOO-den OH-vent",
        emoji: "🌆",
      },
      {
        word: "Gutt Nuecht",
        translation: "Good night",
        pronunciation: "GOOT NUEKT",
        emoji: "🌙",
      },
    ],
    phrases: [
      {
        text: "Wéi geet et dir?",
        translation: "How are you?",
        pronunciation: "VAY geht et DEER",
      },
      {
        text: "Et geet mir gutt, merci.",
        translation: "I am fine, thank you.",
        pronunciation: "et GEHT meer GOOT, MEHR-see",
      },
      {
        text: "Et freet mech.",
        translation: "Nice to meet you.",
        pronunciation: "et FREET mekh",
      },
    ],
    activities: [
      {
        id: "lu-lesson-1-act-1",
        type: "multiple-choice",
        question: 'What does "Moien" mean?',
        correctAnswer: "Hello",
        options: ["Hello", "Goodbye", "Thank you", "Please"],
      },
      {
        id: "lu-lesson-1-act-2",
        type: "multiple-choice",
        question: 'How do you say "Good morning" in Luxembourgish?',
        correctAnswer: "Gudde Moien",
        options: ["Gutt Nuecht", "Gudde Moien", "Gudden Owend", "Äddi"],
      },
      {
        id: "lu-lesson-1-act-3",
        type: "translate",
        question: 'Translate: "Good night"',
        correctAnswer: "Gutt Nuecht",
        hint: "Think about when you go to sleep.",
      },
      {
        id: "lu-lesson-1-act-4",
        type: "multiple-choice",
        question: 'What does "Wéi geet et dir?" mean?',
        correctAnswer: "How are you?",
        options: [
          "How are you?",
          "What is your name?",
          "Where are you from?",
          "Nice to meet you.",
        ],
      },
    ],
    aiTeacherPrompt: {
      systemPrompt: buildAiTeacherSystemPrompt({
        lessonFocus: "Luxembourgish greetings and polite hellos",
        allowedTerms: lessonAllowedTerms(
          [
            { word: "Moien" },
            { word: "Äddi" },
            { word: "Gudde Moien" },
            { word: "Gudden Owend" },
            { word: "Gutt Nuecht" },
          ],
          [
            { text: "Wéi geet et dir?" },
            { text: "Et geet mir gutt, merci." },
            { text: "Et freet mech." },
          ]
        ),
        topics: [
          "greetings",
          "farewells",
          "time-of-day phrases",
          "asking how someone is",
        ],
      }),
      introMessage: buildAiTeacherIntroMessage({
        hook: "today we're learning greetings like Moien, Äddi, and how to ask 'how are you?'",
      }),
      topics: [
        "greetings",
        "farewells",
        "time-of-day phrases",
        "asking how someone is",
      ],
    },
  },

  {
    id: "lu-lesson-2",
    unitId: "lu-unit-1",
    title: "Introductions",
    description: "Introduce yourself and ask for names",
    icon: "🙋",
    xpReward: 10,
    goals: [
      { description: "Learn how to say your name", xpReward: 5 },
      { description: "Ask someone else's name", xpReward: 5 },
    ],
    vocabulary: [
      {
        word: "Ech heeschen",
        translation: "My name is",
        pronunciation: "ekh HEH-shen",
        emoji: "🙋",
      },
      {
        word: "Ech sinn",
        translation: "I am",
        pronunciation: "ekh ZIN",
        emoji: "👤",
      },
      {
        word: "Numm",
        translation: "Name",
        pronunciation: "NOOM",
        emoji: "🏷️",
        audioId: "NUMM1",
      },
      {
        word: "Vu",
        translation: "From",
        pronunciation: "FOO",
        emoji: "📍",
      },
      {
        word: "Freet mech",
        translation: "Pleased to meet you",
        pronunciation: "FREET mekh",
        emoji: "😊",
      },
    ],
    phrases: [
      {
        text: "Wéi heescht Dir?",
        translation: "What is your name?",
        pronunciation: "VAY heesht DEER",
      },
      {
        text: "Ech heeschen Marie.",
        translation: "My name is Marie.",
        pronunciation: "ekh HEH-shen mah-REE",
      },
      {
        text: "Vu wou sidd Dir?",
        translation: "Where are you from?",
        pronunciation: "foo VOO zit DEER",
      },
      {
        text: "Ech sinn vu Lëtzebuerg.",
        translation: "I am from Luxembourg.",
        pronunciation: "ekh ZIN foo LETS-boorg",
      },
    ],
    activities: [
      {
        id: "lu-lesson-2-act-1",
        type: "multiple-choice",
        question: 'How do you say "My name is" in Luxembourgish?',
        correctAnswer: "Ech heeschen",
        options: ["Ech heeschen", "Ech sinn vu", "Wéi heescht", "Freet mech"],
      },
      {
        id: "lu-lesson-2-act-2",
        type: "multiple-choice",
        question: 'What does "Wéi heescht Dir?" mean?',
        correctAnswer: "What is your name?",
        options: [
          "What is your name?",
          "How are you?",
          "Where are you from?",
          "Nice to meet you.",
        ],
      },
      {
        id: "lu-lesson-2-act-3",
        type: "translate",
        question: 'Translate: "Where are you from?"',
        correctAnswer: "Vu wou sidd Dir?",
        hint: 'You start with "Vu" for from.',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt: buildAiTeacherSystemPrompt({
        lessonFocus: "introducing yourself in Luxembourgish",
        allowedTerms: lessonAllowedTerms(
          [
            { word: "Ech heeschen" },
            { word: "Ech sinn" },
            { word: "Numm" },
            { word: "Vu" },
            { word: "Freet mech" },
          ],
          [
            { text: "Wéi heescht Dir?" },
            { text: "Ech heeschen Marie." },
            { text: "Vu wou sidd Dir?" },
            { text: "Ech sinn vu Lëtzebuerg." },
          ]
        ),
        topics: [
          "introductions",
          "saying your name",
          "asking names",
          "where you are from",
        ],
      }),
      introMessage: buildAiTeacherIntroMessage({
        hook: "let's practice introducing yourself — your name and where you're from.",
      }),
      topics: [
        "introductions",
        "saying your name",
        "asking names",
        "where you are from",
      ],
    },
  },

  {
    id: "lu-lesson-3",
    unitId: "lu-unit-1",
    title: "Numbers 1–10",
    description: "Count from one to ten in Luxembourgish",
    icon: "🔢",
    xpReward: 10,
    goals: [
      { description: "Learn numbers 1 to 10", xpReward: 7 },
      { description: "Complete all activities", xpReward: 3 },
    ],
    vocabulary: [
      {
        word: "Eent",
        translation: "1 — One",
        pronunciation: "ENT",
        emoji: "1️⃣",
      },
      {
        word: "Zwou",
        translation: "2 — Two",
        pronunciation: "TSVOO",
        emoji: "2️⃣",
      },
      {
        word: "Dräi",
        translation: "3 — Three",
        pronunciation: "DRAY",
        emoji: "3️⃣",
      },
      {
        word: "Véier",
        translation: "4 — Four",
        pronunciation: "VAY-er",
        emoji: "4️⃣",
      },
      {
        word: "Fënnef",
        translation: "5 — Five",
        pronunciation: "FEN-nef",
        emoji: "5️⃣",
      },
      {
        word: "Sechs",
        translation: "6 — Six",
        pronunciation: "ZEKS",
        emoji: "6️⃣",
      },
      {
        word: "Siwen",
        translation: "7 — Seven",
        pronunciation: "ZEE-ven",
        emoji: "7️⃣",
      },
      {
        word: "Aacht",
        translation: "8 — Eight",
        pronunciation: "AHKT",
        emoji: "8️⃣",
      },
      {
        word: "Néng",
        translation: "9 — Nine",
        pronunciation: "NENG",
        emoji: "9️⃣",
      },
      {
        word: "Zéng",
        translation: "10 — Ten",
        pronunciation: "TSENG",
        emoji: "🔟",
      },
    ],
    phrases: [
      {
        text: "Wéi vill sinn et?",
        translation: "How many are there?",
        pronunciation: "VAY vil ZIN et",
      },
      {
        text: "Et sinn fënnef.",
        translation: "There are five.",
        pronunciation: "et ZIN FEN-nef",
      },
    ],
    activities: [
      {
        id: "lu-lesson-3-act-1",
        type: "multiple-choice",
        question: 'What is "fënnef" in English?',
        correctAnswer: "Five",
        options: ["Three", "Four", "Five", "Six"],
      },
      {
        id: "lu-lesson-3-act-2",
        type: "multiple-choice",
        question: 'How do you say "eight" in Luxembourgish?',
        correctAnswer: "Aacht",
        options: ["Siwen", "Néng", "Aacht", "Sechs"],
      },
      {
        id: "lu-lesson-3-act-3",
        type: "translate",
        question: 'Translate: "Ten"',
        correctAnswer: "Zéng",
        hint: 'It sounds a bit like "tseng".',
      },
    ],
    aiTeacherPrompt: {
      systemPrompt: buildAiTeacherSystemPrompt({
        lessonFocus: "Luxembourgish numbers 1 through 10",
        allowedTerms: lessonAllowedTerms(
          [
            { word: "Eent" },
            { word: "Zwou" },
            { word: "Dräi" },
            { word: "Véier" },
            { word: "Fënnef" },
            { word: "Sechs" },
            { word: "Siwen" },
            { word: "Aacht" },
            { word: "Néng" },
            { word: "Zéng" },
          ],
          [
            { text: "Wéi vill sinn et?" },
            { text: "Et sinn fënnef." },
          ]
        ),
        topics: ["numbers 1-10", "counting", "how many"],
      }),
      introMessage: buildAiTeacherIntroMessage({
        hook: "today we're counting from one to ten in Luxembourgish — eent, zwou, dräi!",
      }),
      topics: ["numbers 1-10", "counting", "how many"],
    },
  },

  {
    id: "lu-lesson-4",
    unitId: "lu-unit-1",
    title: "Politeness",
    description: "Say please, thank you, and sorry",
    icon: "🙏",
    xpReward: 10,
    goals: [
      { description: "Learn polite words", xpReward: 5 },
      { description: "Complete all activities", xpReward: 5 },
    ],
    vocabulary: [
      {
        word: "Merci",
        translation: "Thank you",
        pronunciation: "MEHR-see",
        emoji: "🙏",
        audioId: "MERCI1",
      },
      {
        word: "Merci villmools",
        translation: "Thank you very much",
        pronunciation: "MEHR-see FIL-mohls",
        emoji: "💜",
      },
      {
        word: "Wann ech glift",
        translation: "Please",
        pronunciation: "VAN ekh GLIFT",
        emoji: "✨",
      },
      {
        word: "Pardon",
        translation: "Sorry / Excuse me",
        pronunciation: "par-DON",
        emoji: "😅",
        audioId: "PARDON1",
      },
      {
        word: "Jo",
        translation: "Yes",
        pronunciation: "YOH",
        emoji: "✅",
      },
      {
        word: "Nee",
        translation: "No",
        pronunciation: "NAY",
        emoji: "❌",
      },
    ],
    phrases: [
      {
        text: "Merci, et war schéin.",
        translation: "Thank you, that was nice.",
        pronunciation: "MEHR-see, et VAAR SHAYN",
      },
      {
        text: "Kënnt Dir mir hëllefen, wann ech glift?",
        translation: "Can you help me, please?",
        pronunciation: "KENT DEER meer HEL-lefen, VAN ekh GLIFT",
      },
    ],
    activities: [
      {
        id: "lu-lesson-4-act-1",
        type: "multiple-choice",
        question: 'What does "Merci" mean?',
        correctAnswer: "Thank you",
        options: ["Thank you", "Please", "Sorry", "Hello"],
      },
      {
        id: "lu-lesson-4-act-2",
        type: "multiple-choice",
        question: 'How do you say "Please" in Luxembourgish?',
        correctAnswer: "Wann ech glift",
        options: ["Pardon", "Merci", "Wann ech glift", "Jo"],
      },
      {
        id: "lu-lesson-4-act-3",
        type: "translate",
        question: 'Translate: "Sorry"',
        correctAnswer: "Pardon",
        hint: "Similar to French and English.",
      },
    ],
    aiTeacherPrompt: {
      systemPrompt: buildAiTeacherSystemPrompt({
        lessonFocus: "polite words in Luxembourgish",
        allowedTerms: lessonAllowedTerms(
          [
            { word: "Merci" },
            { word: "Merci villmools" },
            { word: "Wann ech glift" },
            { word: "Pardon" },
            { word: "Jo" },
            { word: "Nee" },
          ],
          [
            { text: "Merci, et war schéin." },
            { text: "Kënnt Dir mir hëllefen, wann ech glift?" },
          ]
        ),
        topics: ["thank you", "please", "sorry", "yes and no"],
      }),
      introMessage: buildAiTeacherIntroMessage({
        hook: "let's learn the essentials — Merci, please, sorry, and yes or no.",
      }),
      topics: ["thank you", "please", "sorry", "yes and no"],
    },
  },

  {
    id: "lu-lesson-5",
    unitId: "lu-unit-1",
    title: "Am Café",
    description: "Order drinks and snacks in Luxembourgish",
    icon: "☕",
    xpReward: 10,
    goals: [
      { description: "Learn café vocabulary", xpReward: 5 },
      { description: "Complete all activities", xpReward: 5 },
    ],
    vocabulary: [
      {
        word: "Kaffi",
        translation: "Coffee",
        pronunciation: "KAH-fee",
        emoji: "☕",
        audioId: "KAFFI1",
      },
      {
        word: "Téi",
        translation: "Tea",
        pronunciation: "TAY",
        emoji: "🍵",
        audioId: "TEI1",
      },
      {
        word: "Waasser",
        translation: "Water",
        pronunciation: "VAH-ser",
        emoji: "💧",
        audioId: "WAASSER2",
      },
      {
        word: "Brout",
        translation: "Bread",
        pronunciation: "BROOT",
        emoji: "🥖",
        audioId: "BROUT1",
      },
      {
        word: "Kuch",
        translation: "Cake",
        pronunciation: "KOOKH",
        emoji: "🍰",
        audioId: "KUCH1",
      },
      {
        word: "Mëllech",
        translation: "Milk",
        pronunciation: "MEL-lekh",
        emoji: "🥛",
        audioId: "MELLECH1",
      },
      {
        word: "Zuocker",
        translation: "Sugar",
        pronunciation: "TSOO-ker",
        emoji: "🧊",
        audioId: "ZOCKER1",
      },
    ],
    phrases: [
      {
        text: "Ech hätt gär e Kaffi, wann ech glift.",
        translation: "I would like a coffee, please.",
        pronunciation: "ekh HET gahr e KAH-fee, VAN ekh GLIFT",
      },
      {
        text: "Wat kascht dat?",
        translation: "How much does that cost?",
        pronunciation: "VAT kasht DAT",
      },
      {
        text: "Déi Rechnung, wann ech glift.",
        translation: "The bill, please.",
        pronunciation: "DEE REKH-noong, VAN ekh GLIFT",
      },
    ],
    activities: [
      {
        id: "lu-lesson-5-act-1",
        type: "multiple-choice",
        question: 'What does "Kaffi" mean?',
        correctAnswer: "Coffee",
        options: ["Coffee", "Tea", "Water", "Cake"],
      },
      {
        id: "lu-lesson-5-act-2",
        type: "multiple-choice",
        question: 'How do you say "I would like a coffee, please"?',
        correctAnswer: "Ech hätt gär e Kaffi, wann ech glift.",
        options: [
          "Ech hätt gär e Kaffi, wann ech glift.",
          "Wat kascht dat?",
          "Gutt Nuecht.",
          "Ech sinn vu Lëtzebuerg.",
        ],
      },
      {
        id: "lu-lesson-5-act-3",
        type: "translate",
        question: 'Translate: "Water"',
        correctAnswer: "Waasser",
        hint: "Sounds like German Wasser.",
      },
    ],
    aiTeacherPrompt: {
      systemPrompt: buildAiTeacherSystemPrompt({
        lessonFocus: "ordering at a café in Luxembourgish",
        allowedTerms: lessonAllowedTerms(
          [
            { word: "Kaffi" },
            { word: "Téi" },
            { word: "Waasser" },
            { word: "Brout" },
            { word: "Kuch" },
            { word: "Mëllech" },
            { word: "Zuocker" },
          ],
          [
            { text: "Ech hätt gär e Kaffi, wann ech glift." },
            { text: "Wat kascht dat?" },
            { text: "Déi Rechnung, wann ech glift." },
          ]
        ),
        topics: ["café", "ordering drinks", "asking the price", "the bill"],
      }),
      introMessage: buildAiTeacherIntroMessage({
        hook: "imagine we're at a café — let's order drinks and snacks in Luxembourgish.",
      }),
      topics: ["café", "ordering drinks", "asking the price", "the bill"],
    },
  },
];

export const LESSONS: Lesson[] = [...HAND_CRAFTED, ...LOD_LESSONS];
