import type { GwsA1ListItem } from "./lodCatalog";

export const WORDS_PER_LESSON = 8;
export const MIN_LESSON_WORDS = 4;
export const HAND_CRAFTED_LESSON_COUNT = 5;

export interface CategoryMeta {
  code: string;
  titleLb: string;
  titleEn: string;
  icon: string;
  topics: string[];
}

export interface UnitPlan {
  id: string;
  title: string;
  description: string;
  order: number;
  icon: string;
  categories: CategoryMeta[];
}

export interface PlannedWord {
  lod_id: string;
  word_lb: string;
  categoryCode: string;
}

export interface LessonPlan {
  id: string;
  unitId: string;
  title: string;
  description: string;
  icon: string;
  topics: string[];
  words: PlannedWord[];
}

/** Thematic LOD categories used to group GWS A1 vocabulary (priority = first match). */
export const CATEGORY_ORDER: CategoryMeta[] = [
  { code: "IESSEN", titleLb: "Iessen", titleEn: "Food", icon: "🍽️", topics: ["food", "meals"] },
  { code: "GEDRENKS", titleLb: "Gedrénks", titleEn: "Drinks", icon: "🥤", topics: ["drinks"] },
  { code: "FAMILL", titleLb: "Famill", titleEn: "Family", icon: "👨‍👩‍👧‍👦", topics: ["family"] },
  { code: "PERSOUN", titleLb: "Leit", titleEn: "People", icon: "🧑", topics: ["people", "persons"] },
  { code: "FAARF", titleLb: "Faarwen", titleEn: "Colors", icon: "🎨", topics: ["colors"] },
  { code: "MOUNT", titleLb: "Méint", titleEn: "Months", icon: "📅", topics: ["months", "calendar"] },
  { code: "METEO", titleLb: "Meteo", titleEn: "Weather", icon: "🌤️", topics: ["weather"] },
  { code: "WIEDER", titleLb: "Wieder", titleEn: "Weather", icon: "🌦️", topics: ["weather", "seasons"] },
  { code: "SCHOUL", titleLb: "Schoul", titleEn: "School", icon: "🏫", topics: ["school"] },
  { code: "UEBST", titleLb: "Uebst", titleEn: "Fruits", icon: "🍎", topics: ["fruits"] },
  { code: "GEMEIS", titleLb: "Geméis", titleEn: "Vegetables", icon: "🥬", topics: ["vegetables"] },
  { code: "DEIER", titleLb: "Déieren", titleEn: "Animals", icon: "🐾", topics: ["animals"] },
  { code: "ANAT", titleLb: "Kierper", titleEn: "Body", icon: "🫀", topics: ["body parts"] },
  { code: "PLANTE", titleLb: "Planzen", titleEn: "Plants", icon: "🌿", topics: ["plants"] },
  { code: "FESCH", titleLb: "Fësch", titleEn: "Fish", icon: "🐟", topics: ["fish"] },
  { code: "BLUMM", titleLb: "Blummen", titleEn: "Flowers", icon: "🌸", topics: ["flowers"] },
  { code: "GEFIER", titleLb: "Gefierer", titleEn: "Vehicles", icon: "🚗", topics: ["vehicles"] },
  { code: "SPORT", titleLb: "Sport", titleEn: "Sports", icon: "⚽", topics: ["sports"] },
  { code: "FEIERDEEG", titleLb: "Feierdeeg", titleEn: "Holidays", icon: "🎉", topics: ["holidays"] },
  { code: "FEST", titleLb: "Fester", titleEn: "Festivals", icon: "🎊", topics: ["festivals"] },
  { code: "MOOSSEENHEET", titleLb: "Moosseenheeten", titleEn: "Measurements", icon: "📏", topics: ["measurements"] },
  { code: "FUSSBALL", titleLb: "Fussball", titleEn: "Football", icon: "⚽", topics: ["football"] },
  { code: "OLYMPIA", titleLb: "Olympia", titleEn: "Olympics", icon: "🏅", topics: ["olympics"] },
  { code: "HALLOWEEN", titleLb: "Halloween", titleEn: "Halloween", icon: "🎃", topics: ["halloween"] },
  { code: "SPILLPLAZ", titleLb: "Spillplaz", titleEn: "Playground", icon: "🛝", topics: ["playground"] },
  { code: "BERUFFSBEZEECHNUNG", titleLb: "Beruffer", titleEn: "Jobs", icon: "💼", topics: ["jobs", "professions"] },
  { code: "MED", titleLb: "Medezin", titleEn: "Medicine", icon: "🏥", topics: ["health", "medicine"] },
  { code: "KLEESCHEN", titleLb: "Kleeschen", titleEn: "Church", icon: "⛪", topics: ["church", "religion"] },
  { code: "INFO", titleLb: "Informatik", titleEn: "Computing", icon: "💻", topics: ["computing"] },
  { code: "CORONA", titleLb: "Covid-19", titleEn: "Covid-19", icon: "😷", topics: ["covid-19"] },
  { code: "AUSRUFF", titleLb: "Ausriff", titleEn: "Exclamations", icon: "❗", topics: ["exclamations"] },
  { code: "INTERJEKTIOUN", titleLb: "Interjektiounen", titleEn: "Interjections", icon: "💬", topics: ["interjections"] },
  { code: "FRECHHEET", titleLb: "Frechheeten", titleEn: "Insults", icon: "😤", topics: ["expressions"] },
  { code: "KRAUTGEWIERZ", titleLb: "Kraider", titleEn: "Herbs & spices", icon: "🌿", topics: ["herbs", "spices"] },
  { code: "WARUNG", titleLb: "Wärungen", titleEn: "Currencies", icon: "💶", topics: ["currencies"] },
  { code: "LITERATUR", titleLb: "Literatur", titleEn: "Literature", icon: "📚", topics: ["literature"] },
  { code: "MUSEKSINSTRUMENT", titleLb: "Instrumenter", titleEn: "Instruments", icon: "🎵", topics: ["music"] },
  { code: "CHEEMESCHT-ELEMENT", titleLb: "Elementer", titleEn: "Elements", icon: "⚗️", topics: ["chemistry"] },
  { code: "NOSS", titleLb: "Nëss", titleEn: "Nuts", icon: "🥜", topics: ["nuts"] },
];

export const UNIT_PLANS: UnitPlan[] = [
  {
    id: "lu-unit-2",
    order: 2,
    title: "Iessen & Gedrénks — Food & Drinks",
    description: "GWS A1 food and drink vocabulary",
    icon: "🍽️",
    categories: CATEGORY_ORDER.filter((c) =>
      ["IESSEN", "GEDRENKS"].includes(c.code)
    ),
  },
  {
    id: "lu-unit-3",
    order: 3,
    title: "Famill & Leit — Family & People",
    description: "GWS A1 family and people vocabulary",
    icon: "👨‍👩‍👧‍👦",
    categories: CATEGORY_ORDER.filter((c) =>
      ["FAMILL", "PERSOUN"].includes(c.code)
    ),
  },
  {
    id: "lu-unit-4",
    order: 4,
    title: "Ëm eis erëm — Around Us",
    description: "Colors, months, weather, and school",
    icon: "🎨",
    categories: CATEGORY_ORDER.filter((c) =>
      ["FAARF", "MOUNT", "METEO", "WIEDER", "SCHOUL"].includes(c.code)
    ),
  },
  {
    id: "lu-unit-5",
    order: 5,
    title: "Natur — Nature",
    description: "Plants, fruits, vegetables, animals, and body",
    icon: "🌿",
    categories: CATEGORY_ORDER.filter((c) =>
      ["UEBST", "GEMEIS", "DEIER", "ANAT", "PLANTE", "FESCH", "BLUMM", "NOSS"].includes(
        c.code
      )
    ),
  },
  {
    id: "lu-unit-6",
    order: 6,
    title: "Alldaag — Everyday Life",
    description: "Transport, sports, holidays, and celebrations",
    icon: "🚗",
    categories: CATEGORY_ORDER.filter((c) =>
      [
        "GEFIER",
        "SPORT",
        "FEIERDEEG",
        "MOOSSEENHEET",
        "FEST",
        "FUSSBALL",
        "OLYMPIA",
        "HALLOWEEN",
        "SPILLPLAZ",
      ].includes(c.code)
    ),
  },
  {
    id: "lu-unit-7",
    order: 7,
    title: "Aarbecht & Gesondheet — Work & Health",
    description: "Jobs, medicine, church, and computing",
    icon: "💼",
    categories: CATEGORY_ORDER.filter((c) =>
      ["BERUFFSBEZEECHNUNG", "MED", "KLEESCHEN", "INFO", "CORONA"].includes(c.code)
    ),
  },
  {
    id: "lu-unit-8",
    order: 8,
    title: "Sprooch & Ausdréck — Language & Expressions",
    description: "Exclamations, interjections, and misc. expressions",
    icon: "💬",
    categories: CATEGORY_ORDER.filter((c) =>
      [
        "AUSRUFF",
        "INTERJEKTIOUN",
        "FRECHHEET",
        "KRAUTGEWIERZ",
        "WARUNG",
        "LITERATUR",
        "MUSEKSINSTRUMENT",
        "CHEEMESCHT-ELEMENT",
      ].includes(c.code)
    ),
  },
  {
    id: "lu-unit-9",
    order: 9,
    title: "A1 Wuertlëscht — Core A1 Vocabulary",
    description:
      "Remaining words from Schwätzt Dir Lëtzebuergesch? Niveau A1 (Wuertschatz)",
    icon: "📖",
    categories: [],
  },
];

export function chunk<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  if (chunks.length > 1 && chunks[chunks.length - 1]!.length < MIN_LESSON_WORDS) {
    const tail = chunks.pop()!;
    chunks[chunks.length - 1]!.push(...tail);
  }
  return chunks;
}

export function assignGwsA1Words(
  gwsList: GwsA1ListItem[],
  categoryMembers: Map<string, Set<string>>
): Map<string, string> {
  const gwsIds = new Set(gwsList.map((item) => item.article_id));
  const assignment = new Map<string, string>();

  for (const category of CATEGORY_ORDER) {
    const members = categoryMembers.get(category.code);
    if (!members) continue;
    for (const id of members) {
      if (!gwsIds.has(id) || assignment.has(id)) continue;
      assignment.set(id, category.code);
    }
  }

  return assignment;
}

export function buildLessonPlans(
  gwsList: GwsA1ListItem[],
  assignment: Map<string, string>
): { units: UnitPlan[]; lessons: LessonPlan[] } {
  const gwsMap = new Map(gwsList.map((item) => [item.article_id, item.word_lb]));
  let lessonCounter = HAND_CRAFTED_LESSON_COUNT + 1;
  const lessons: LessonPlan[] = [];

  for (const unit of UNIT_PLANS) {
    if (unit.id === "lu-unit-9") continue;

    for (const category of unit.categories) {
      const wordIds = [...assignment.entries()]
        .filter(([, code]) => code === category.code)
        .map(([id]) => id)
        .sort((a, b) =>
          (gwsMap.get(a) ?? a).localeCompare(gwsMap.get(b) ?? b, "lb")
        );

      const chunks = chunk(wordIds, WORDS_PER_LESSON);
      chunks.forEach((ids, index) => {
        const num = chunks.length > 1 ? ` ${index + 1}` : "";
        lessons.push({
          id: `lu-lesson-${lessonCounter++}`,
          unitId: unit.id,
          title: `${category.titleLb}${num} — ${category.titleEn}${num}`,
          description: `GWS A1 ${category.titleEn.toLowerCase()} vocabulary`,
          icon: category.icon,
          topics: category.topics,
          words: ids.map((lod_id) => ({
            lod_id,
            word_lb: gwsMap.get(lod_id) ?? lod_id,
            categoryCode: category.code,
          })),
        });
      });
    }
  }

  const coreIds = gwsList
    .map((item) => item.article_id)
    .filter((id) => !assignment.has(id))
    .sort((a, b) =>
      (gwsMap.get(a) ?? a).localeCompare(gwsMap.get(b) ?? b, "lb")
    );

  const coreChunks = chunk(coreIds, WORDS_PER_LESSON);
  coreChunks.forEach((ids, index) => {
    lessons.push({
      id: `lu-lesson-${lessonCounter++}`,
      unitId: "lu-unit-9",
      title: `A1 Core ${index + 1} — Essential words`,
      description:
        "Core vocabulary from LOD Schwätzt Dir Lëtzebuergesch? Niveau A1",
      icon: "📖",
      topics: ["everyday vocabulary", "A1 core"],
      words: ids.map((lod_id) => ({
        lod_id,
        word_lb: gwsMap.get(lod_id) ?? lod_id,
        categoryCode: "CORE",
      })),
    });
  });

  const units = UNIT_PLANS.filter(
    (unit) => lessons.some((lesson) => lesson.unitId === unit.id)
  );

  return { units, lessons };
}
