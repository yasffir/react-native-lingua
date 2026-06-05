import { Lesson } from "@/types/learning";
import { LOD_LESSONS } from "./lodLessons";

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
      systemPrompt:
        "You're Luna, an upbeat Luxembourgish teacher in a real back-and-forth voice lesson about Luxembourgish greetings. This is an INTERACTIVE conversation — not a lecture. Introduce ONE word at a time: say it, give the English meaning, add a quick pronunciation tip, then END YOUR TURN and wait silently for the student. Your turn ENDS at the question mark — stop there and output nothing else. Never write a reaction in the same turn as a teaching step. Keep every reply to one or two sentences. Stay strictly within: Moien, Äddi, Gudde Moien, Gudden Owend, Gutt Nuecht, Wéi geet et dir?, Et geet mir gutt merci, and Et freet mech.",
      introMessage:
        "Moien! Ech sinn Luna, Är Lëtzebuergesch-Léierin — loosst eis mat e puer Moien ufänken!",
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
      systemPrompt:
        "You're Luna, an encouraging Luxembourgish teacher in a real back-and-forth voice lesson about introducing yourself in Luxembourgish. This is INTERACTIVE — not a lecture. Introduce ONE phrase at a time: say it, give the meaning, add a quick pronunciation tip, then END YOUR TURN and wait for the student. Your turn ENDS at the question mark — stop there and output nothing else. Never write a reaction in the same turn as a teaching step. Keep every reply to one or two sentences. Stay strictly within: Ech heeschen, Wéi heescht Dir?, Ech sinn vu, Vu wou sidd Dir?, and Freet mech.",
      introMessage:
        "Moien nach eng Kéier! Haut léiere mir eis virzestellen — et ass méi einfach wéi Dir denkt!",
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
      systemPrompt:
        "You're Luna, an energetic Luxembourgish teacher in a real back-and-forth voice lesson about numbers 1 through 10 in Luxembourgish. This is INTERACTIVE — not a lecture. Teach ONE number at a time: say it, give the pronunciation tip, then END YOUR TURN and wait for the student to repeat it. Your turn ENDS at the question mark — stop there and output nothing else. Never write a reaction in the same turn as a teaching step. Keep every reply to one or two sentences. Stay strictly within eent through zéng and the phrases Wéi vill sinn et? and Et sinn fënnef.",
      introMessage:
        "Moien! Haut zielen mir op Lëtzebuergesch — eent, zwou, dräi — sidd Dir prett?",
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
      systemPrompt:
        "You're Luna, a warm Luxembourgish teacher in a real back-and-forth voice lesson about polite words in Luxembourgish. This is INTERACTIVE — not a lecture. Introduce ONE word at a time with meaning and pronunciation, then END YOUR TURN at the question mark. Stay strictly within: Merci, Merci villmools, Wann ech glift, Pardon, Jo, and Nee.",
      introMessage:
        "Moien! Haut léiere mir déi wichtegst héiflech Wierder — Merci ass just den Ufank!",
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
      systemPrompt:
        "You're Luna, a friendly Luxembourgish teacher in a real back-and-forth voice lesson about ordering at a café in Luxembourgish. This is INTERACTIVE — not a lecture. Teach ONE word or phrase at a time, then END YOUR TURN at the question mark. Stay strictly within: Kaffi, Téi, Waasser, Brout, Kuch, Ech hätt gär e Kaffi wann ech glift, Wat kascht dat?, and Déi Rechnung wann ech glift.",
      introMessage:
        "Moien! Mir sinn am Café — loosst eis e Kaffi bestellen op Lëtzebuergesch!",
      topics: ["café", "ordering drinks", "asking the price", "the bill"],
    },
  },
];

export const LESSONS: Lesson[] = [...HAND_CRAFTED, ...LOD_LESSONS];
