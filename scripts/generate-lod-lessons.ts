#!/usr/bin/env tsx
/**
 * Generate LOD-based lessons from GWS A1 vocabulary data.
 *
 * Reads GWS A1 vocabulary and thematic category files from the LOD dataset,
 * cross-references them to find A1-level words with clear topics, and
 * generates TypeScript data files for the app.
 *
 * Usage: npx tsx scripts/generate-lod-lessons.ts
 */
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const LOD_DIR =
  "/Users/nay/Library/CloudStorage/GoogleDrive-nayneissil@gmail.com/My Drive/letz/lod_data/by_category";
const AUDIO_SRC_DIR =
  "/Users/nay/Library/CloudStorage/GoogleDrive-nayneissil@gmail.com/My Drive/letz/lod_data/audio";
const OUT_DIR = path.resolve(__dirname, "..", "data");
const AUDIO_OUT_DIR = path.resolve(__dirname, "..", "assets", "audio");

// ─── Types ───────────────────────────────────────────────────────────────

interface LodEntry {
  lod_id: string;
  word_lb: string;
  ipa: string;
  part_of_speech: string;
  category_code: string;
  en: string;
  fr: string;
  de: string;
  pt: string;
}

interface Word {
  lod_id: string;
  word_lb: string;
  en: string;
  fr: string;
  de: string;
  pt: string;
  ipa: string;
  emoji: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────

function readJson(file: string): LodEntry[] {
  return JSON.parse(fs.readFileSync(path.join(LOD_DIR, file), "utf-8"));
}

function firstEn(en: string): string {
  if (!en || !en.trim()) return "";
  return en.split(";")[0].trim();
}

const MIN_LESSON_WORDS = 4;

function chunk<T>(arr: T[], size: number): T[][] {
  const r: T[][] = [];
  for (let i = 0; i < arr.length; i += size) r.push(arr.slice(i, i + size));
  // Merge last chunk into previous if it's too small for exercises
  if (r.length > 1 && r[r.length - 1].length < MIN_LESSON_WORDS) {
    const last = r.pop()!;
    r[r.length - 1].push(...last);
  }
  return r;
}

function escapeStr(s: string): string {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
}

// ─── Emoji Mapping ───────────────────────────────────────────────────────

const WORD_EMOJI: Record<string, string> = {
  // Food
  bread: "🍞",
  cake: "🎂",
  cheese: "🧀",
  butter: "🧈",
  egg: "🥚",
  meat: "🥩",
  chicken: "🍗",
  fish: "🐟",
  rice: "🍚",
  pasta: "🍝",
  noodle: "🍜",
  pizza: "🍕",
  soup: "🍲",
  salad: "🥗",
  sandwich: "🥪",
  ham: "🥓",
  sausage: "🌭",
  honey: "🍯",
  jam: "🫙",
  chocolate: "🍫",
  "ice cream": "🍦",
  cookie: "🍪",
  sugar: "🍬",
  salt: "🧂",
  pepper: "🫑",
  flour: "🌾",
  oil: "🫒",
  cream: "🍦",
  cereal: "🥣",
  yogurt: "🥛",
  yoghurt: "🥛",
  pancake: "🥞",
  waffle: "🧇",
  pie: "🥧",
  croissant: "🥐",
  pretzel: "🥨",
  dumpling: "🥟",
  fries: "🍟",
  chips: "🍟",
  popcorn: "🍿",
  candy: "🍬",
  sweet: "🍬",
  lollipop: "🍭",
  doughnut: "🍩",
  biscuit: "🍪",
  muffin: "🧁",
  tart: "🥧",
  "whipped cream": "🍦",
  nutella: "🍫",
  "peanut butter": "🥜",
  nut: "🥜",
  walnut: "🥜",
  hazelnut: "🌰",
  chestnut: "🌰",
  almond: "🥜",
  gum: "🫧",
  "chewing gum": "🫧",
  bonbon: "🍬",
  mustard: "🟡",
  ketchup: "🍅",
  mayonnaise: "🥚",
  sauce: "🫙",
  vinegar: "🫙",
  cinnamon: "🟤",
  nutmeg: "🟤",
  spice: "🧂",
  herb: "🌿",
  garlic: "🧄",
  onion: "🧅",
  potato: "🥔",
  tomato: "🍅",
  mushroom: "🍄",

  // Drinks
  coffee: "☕",
  tea: "🍵",
  water: "💧",
  milk: "🥛",
  juice: "🧃",
  beer: "🍺",
  wine: "🍷",
  lemonade: "🍋",
  cocoa: "☕",
  "hot chocolate": "☕",
  cocktail: "🍹",
  champagne: "🥂",
  soda: "🥤",
  cola: "🥤",
  espresso: "☕",
  cappuccino: "☕",
  liqueur: "🍸",
  brandy: "🥃",
  whisky: "🥃",
  rum: "🍹",
  vodka: "🍸",
  absinthe: "🍸",
  aperitif: "🍸",
  cider: "🍺",
  "mineral water": "💧",
  latte: "☕",

  // Fruits
  apple: "🍎",
  banana: "🍌",
  orange: "🍊",
  strawberry: "🍓",
  grape: "🍇",
  lemon: "🍋",
  pear: "🍐",
  peach: "🍑",
  cherry: "🍒",
  watermelon: "🍉",
  pineapple: "🍍",
  kiwi: "🥝",
  coconut: "🥥",
  mango: "🥭",
  plum: "🫐",
  melon: "🍈",
  raspberry: "🫐",
  blueberry: "🫐",
  blackberry: "🫐",
  fig: "🫒",
  apricot: "🍑",
  nectarine: "🍑",
  tangerine: "🍊",
  mandarin: "🍊",
  clementine: "🍊",
  grapefruit: "🍊",
  lime: "🍋",
  cranberry: "🫐",
  gooseberry: "🫐",
  currant: "🫐",
  date: "🌴",
  pomegranate: "🫐",
  quince: "🍐",
  rhubarb: "🌿",
  "passion fruit": "🫐",
  mirabelle: "🍑",

  // Vegetables
  carrot: "🥕",
  broccoli: "🥦",
  corn: "🌽",
  cucumber: "🥒",
  lettuce: "🥬",
  pea: "🟢",
  bean: "🫘",
  eggplant: "🍆",
  cabbage: "🥬",
  cauliflower: "🥦",
  celery: "🥬",
  leek: "🧅",
  spinach: "🥬",
  zucchini: "🥒",
  courgette: "🥒",
  radish: "🟣",
  turnip: "🟡",
  beetroot: "🟣",
  artichoke: "🥬",
  asparagus: "🥬",
  endive: "🥬",
  parsley: "🌿",
  pumpkin: "🎃",
  squash: "🎃",
  "Brussels sprouts": "🥬",
  fennel: "🌿",
  kohlrabi: "🥬",
  swede: "🟡",
  rutabaga: "🟡",

  // Colors
  red: "🔴",
  blue: "🔵",
  green: "🟢",
  yellow: "🟡",
  purple: "🟣",
  black: "⚫",
  white: "⚪",
  brown: "🟤",
  pink: "🩷",
  grey: "🩶",
  gray: "🩶",
  golden: "🌟",
  silver: "🪩",
  beige: "🟡",
  blond: "👱",
  violet: "🟣",
  turquoise: "🔵",
  "blood red": "🔴",
  "dark blue": "🔵",
  "light blue": "🔵",

  // Family
  mother: "👩",
  father: "👨",
  mum: "👩",
  dad: "👨",
  sister: "👧",
  brother: "👦",
  grandmother: "👵",
  grandfather: "👴",
  grandma: "👵",
  grandpa: "👴",
  baby: "👶",
  son: "👦",
  daughter: "👧",
  uncle: "👨",
  aunt: "👩",
  cousin: "🧑",
  child: "🧒",
  parent: "👪",
  family: "👨‍👩‍👧‍👦",
  husband: "👨",
  wife: "👩",
  boy: "👦",
  girl: "👧",
  man: "👨",
  woman: "👩",
  twin: "👯",
  godfather: "👨",
  godmother: "👩",
  "great-grandmother": "👵",
  "great-grandfather": "👴",
  "son-in-law": "👨",
  "daughter-in-law": "👩",
  "brother-in-law": "👨",
  "sister-in-law": "👩",
  "father-in-law": "👨",
  "mother-in-law": "👩",
  nephew: "👦",
  niece: "👧",
  stepfather: "👨",
  stepmother: "👩",
  "adoptive parents": "👪",
  fiancé: "💍",
  fiancée: "💍",
  widow: "👩",
  widower: "👨",
  orphan: "🧒",
  godchild: "🧒",

  // Weather
  sun: "☀️",
  rain: "🌧️",
  snow: "❄️",
  wind: "💨",
  cloud: "☁️",
  storm: "⛈️",
  thunder: "⚡",
  lightning: "⚡",
  ice: "🧊",
  fog: "🌫️",
  rainbow: "🌈",
  temperature: "🌡️",
  hot: "🔥",
  cold: "🥶",
  warm: "🌡️",
  hail: "🌨️",
  frost: "❄️",
  drought: "🏜️",
  flood: "🌊",
  heat: "🔥",
  thermometer: "🌡️",
  degree: "🌡️",
  climate: "🌍",
  weather: "🌤️",
  "April weather": "🌦️",
  cloudy: "☁️",
  rainy: "🌧️",
  sunny: "☀️",
  snowy: "❄️",
  windy: "💨",

  // Months
  january: "❄️",
  february: "💕",
  march: "🌱",
  april: "🌸",
  may: "🌺",
  june: "☀️",
  july: "🏖️",
  august: "🌻",
  september: "🍂",
  october: "🎃",
  november: "🍁",
  december: "🎄",

  // School
  book: "📚",
  pen: "🖊️",
  pencil: "✏️",
  school: "🏫",
  teacher: "👩‍🏫",
  student: "🧑‍🎓",
  paper: "📄",
  notebook: "📓",
  ruler: "📏",
  eraser: "🧹",
  desk: "🪑",
  board: "📋",
  homework: "📝",
  exam: "📝",
  alphabet: "🔤",
  abc: "🔤",
  chalk: "🖍️",
  dictionary: "📖",
  library: "📚",
  calculator: "🧮",
  scissors: "✂️",
  glue: "🧴",
  stapler: "📌",
  backpack: "🎒",
  lesson: "📖",
  class: "📖",
  blackboard: "🖥️",
  map: "🗺️",
  globe: "🌍",
  paint: "🎨",
  crayon: "🖍️",
  magnifying: "🔍",

  // Animals
  dog: "🐕",
  cat: "🐈",
  bird: "🐦",
  horse: "🐴",
  cow: "🐄",
  pig: "🐷",
  sheep: "🐑",
  duck: "🦆",
  eagle: "🦅",
  monkey: "🐒",
  ape: "🐒",
  lion: "🦁",
  bear: "🐻",
  rabbit: "🐰",
  mouse: "🐭",
  goat: "🐐",
  hen: "🐔",
  rooster: "🐓",
  donkey: "🫏",
  deer: "🦌",
  fox: "🦊",
  wolf: "🐺",
  frog: "🐸",
  snake: "🐍",
  turtle: "🐢",
  butterfly: "🦋",
  bee: "🐝",
  ant: "🐜",
  spider: "🕷️",
  whale: "🐋",
  dolphin: "🐬",
  penguin: "🐧",
  owl: "🦉",
  parrot: "🦜",
  elephant: "🐘",
  tiger: "🐯",
  giraffe: "🦒",
  zebra: "🦓",
  camel: "🐫",
  kangaroo: "🦘",
  koala: "🐨",
  crocodile: "🐊",
  shark: "🦈",
  octopus: "🐙",
  snail: "🐌",
  worm: "🪱",
  ladybird: "🐞",
  ladybug: "🐞",
  hedgehog: "🦔",
  squirrel: "🐿️",
  bat: "🦇",
  swan: "🦢",
  peacock: "🦚",
  flamingo: "🦩",
  stork: "🪿",

  // Body parts
  eye: "👁️",
  ear: "👂",
  nose: "👃",
  mouth: "👄",
  hand: "✋",
  foot: "🦶",
  arm: "💪",
  leg: "🦵",
  head: "🗣️",
  heart: "❤️",
  finger: "👆",
  tooth: "🦷",
  hair: "💇",
  face: "😊",
  knee: "🦵",
  shoulder: "💪",
  stomach: "🫄",
  back: "🔙",
  neck: "🦒",
  tongue: "👅",
  lip: "👄",
  thumb: "👍",
  elbow: "💪",
  chin: "😊",
  forehead: "😊",
  cheek: "😊",
  eyebrow: "🤨",
  eyelash: "👁️",
  nail: "💅",
  skin: "🤲",
  bone: "🦴",
  muscle: "💪",
  brain: "🧠",
  lung: "🫁",
  liver: "🫀",
  kidney: "🫘",
  blood: "🩸",

  // Vehicles
  car: "🚗",
  bus: "🚌",
  train: "🚂",
  airplane: "✈️",
  plane: "✈️",
  bicycle: "🚲",
  bike: "🚲",
  motorcycle: "🏍️",
  boat: "🚤",
  ship: "🚢",
  truck: "🚛",
  taxi: "🚕",
  ambulance: "🚑",
  helicopter: "🚁",
  subway: "🚇",
  tram: "🚊",
  scooter: "🛵",
  van: "🚐",
  lorry: "🚛",
  "fire engine": "🚒",
  "police car": "🚓",
  rocket: "🚀",
  sailboat: "⛵",
  canoe: "🛶",
  tractor: "🚜",

  // Sports
  football: "⚽",
  soccer: "⚽",
  tennis: "🎾",
  basketball: "🏀",
  swimming: "🏊",
  running: "🏃",
  cycling: "🚴",
  golf: "⛳",
  skiing: "⛷️",
  volleyball: "🏐",
  handball: "🤾",
  hockey: "🏒",
  boxing: "🥊",
  judo: "🥋",
  karate: "🥋",
  wrestling: "🤼",
  gymnastics: "🤸",
  surfing: "🏄",
  archery: "🏹",
  fencing: "🤺",
  badminton: "🏸",
  "table tennis": "🏓",
  rugby: "🏉",
  baseball: "⚾",
  cricket: "🏏",
  referee: "🏁",
  offside: "🚫",
  aerobics: "🤸",
  athletics: "🏃",
  marathon: "🏃",
  sprint: "🏃",
  diving: "🤿",

  // Holidays
  christmas: "🎄",
  easter: "🐣",
  birthday: "🎂",
  "new year": "🎆",
  carnival: "🎭",
  advent: "🕯️",
  halloween: "🎃",
  wedding: "💒",
  "national day": "🇱🇺",
  "all saints": "⛪",
  pentecost: "⛪",
  ascension: "⛪",
  "st nicholas": "🎅",
  "mother's day": "💐",
  "father's day": "👨",
  "valentine's day": "💕",
  "advent calendar": "📅",

  // Measurements
  meter: "📏",
  kilogram: "⚖️",
  gram: "⚖️",
  liter: "🧪",
  litre: "🧪",
  celsius: "🌡️",
  kilometer: "📏",
  centimeter: "📏",
  millimeter: "📏",
  ton: "⚖️",
  second: "⏱️",
  minute: "⏱️",
  hour: "🕐",
  ampere: "⚡",
  volt: "⚡",
  watt: "💡",
  hectare: "🌾",
  acre: "🌾",
  mile: "📏",
  inch: "📏",
  pound: "⚖️",
  ounce: "⚖️",
  percent: "💯",

  // Musical instruments
  piano: "🎹",
  guitar: "🎸",
  violin: "🎻",
  drum: "🥁",
  trumpet: "🎺",
  flute: "🎵",
  accordion: "🪗",
  banjo: "🪕",
  harp: "🎵",
  organ: "🎹",
  saxophone: "🎷",
  clarinet: "🎵",
  trombone: "🎺",
  cello: "🎻",
  bass: "🎸",
  recorder: "🎵",
  harmonica: "🎵",
  xylophone: "🎵",
  tambourine: "🥁",
  triangle: "🔔",
  bagpipes: "🎵",
  ukulele: "🎸",
  oboe: "🎵",
  tuba: "🎺",
  cymbal: "🥁",
};

const CATEGORY_EMOJI: Record<string, string> = {
  IESSEN: "🍽️",
  GEDRENKS: "🥤",
  FAMILL: "👨‍👩‍👧‍👦",
  FAARF: "🎨",
  MOUNT: "📅",
  METEO: "🌤️",
  SCHOUL: "🏫",
  UEBST: "🍎",
  GEMEIS: "🥬",
  DEIER: "🐾",
  ANAT: "🫀",
  GEFIER: "🚗",
  SPORT: "⚽",
  FEIERDEEG: "🎉",
  MOOSSEENHEET: "📏",
  MUSEKSINSTRUMENT: "🎵",
};

function getEmoji(en: string, category: string): string {
  const lower = en.toLowerCase();
  if (WORD_EMOJI[lower]) return WORD_EMOJI[lower];
  for (const [key, emoji] of Object.entries(WORD_EMOJI)) {
    if (lower.includes(key) || key.includes(lower)) return emoji;
  }
  return CATEGORY_EMOJI[category] || "📝";
}

// ─── Load A1 vocabulary ──────────────────────────────────────────────────

const a1 = readJson("GWS A1.json");
const a1Ids = new Set(a1.map((e) => e.lod_id));
const a1Map = new Map(a1.map((e) => [e.lod_id, e]));

console.log(`GWS A1: ${a1.length} entries`);

// ─── Cross-reference A1 with category ────────────────────────────────────

function getA1InCategory(catFile: string, catCode: string): Word[] {
  const cat = readJson(catFile);
  const seen = new Set<string>();
  const words: Word[] = [];

  for (const entry of cat) {
    if (!a1Ids.has(entry.lod_id) || seen.has(entry.lod_id)) continue;
    seen.add(entry.lod_id);
    const a1e = a1Map.get(entry.lod_id)!;
    const en = firstEn(a1e.en);
    if (!en) continue;
    words.push({
      lod_id: a1e.lod_id,
      word_lb: a1e.word_lb,
      en,
      fr: firstEn(a1e.fr),
      de: firstEn(a1e.de),
      pt: firstEn(a1e.pt),
      ipa: a1e.ipa || "",
      emoji: getEmoji(en, catCode),
    });
  }

  return words;
}

// ─── Unit & Category Definitions ─────────────────────────────────────────

interface CatSpec {
  code: string;
  file: string;
  titleLb: string;
  titleEn: string;
  icon: string;
  topics: string[];
}

interface UnitSpec {
  id: string;
  title: string;
  description: string;
  order: number;
  categories: CatSpec[];
}

const UNIT_SPECS: UnitSpec[] = [
  {
    id: "lu-unit-2",
    title: "Iessen & Gedrénks — Food & Drinks",
    description: "Learn food and drink vocabulary in Luxembourgish",
    order: 2,
    categories: [
      {
        code: "IESSEN",
        file: "IESSEN.json",
        titleLb: "Iessen",
        titleEn: "Food",
        icon: "🍽️",
        topics: ["food", "meals", "cooking ingredients"],
      },
      {
        code: "GEDRENKS",
        file: "GEDRENKS.json",
        titleLb: "Gedrénks",
        titleEn: "Drinks",
        icon: "🥤",
        topics: ["drinks", "beverages"],
      },
    ],
  },
  {
    id: "lu-unit-3",
    title: "Famill — Family",
    description: "Learn family vocabulary in Luxembourgish",
    order: 3,
    categories: [
      {
        code: "FAMILL",
        file: "FAMILL.json",
        titleLb: "Famill",
        titleEn: "Family",
        icon: "👨‍👩‍👧‍👦",
        topics: ["family", "relationships", "relatives"],
      },
    ],
  },
  {
    id: "lu-unit-4",
    title: "Ëm eis erëm — Around Us",
    description: "Colors, months, weather, and school in Luxembourgish",
    order: 4,
    categories: [
      {
        code: "FAARF",
        file: "FAARF.json",
        titleLb: "Faarwen",
        titleEn: "Colors",
        icon: "🎨",
        topics: ["colors", "descriptions"],
      },
      {
        code: "MOUNT",
        file: "MOUNT.json",
        titleLb: "Méint",
        titleEn: "Months",
        icon: "📅",
        topics: ["months", "calendar", "time"],
      },
      {
        code: "METEO",
        file: "METEO.json",
        titleLb: "Wieder",
        titleEn: "Weather",
        icon: "🌤️",
        topics: ["weather", "seasons", "climate"],
      },
      {
        code: "SCHOUL",
        file: "SCHOUL.json",
        titleLb: "Schoul",
        titleEn: "School",
        icon: "🏫",
        topics: ["school", "education", "classroom"],
      },
    ],
  },
  {
    id: "lu-unit-5",
    title: "Natur — Nature",
    description: "Fruits, vegetables, animals, and body parts in Luxembourgish",
    order: 5,
    categories: [
      {
        code: "UEBST",
        file: "UEBST.json",
        titleLb: "Uebst",
        titleEn: "Fruits",
        icon: "🍎",
        topics: ["fruits"],
      },
      {
        code: "GEMEIS",
        file: "GEMEIS.json",
        titleLb: "Geméis",
        titleEn: "Vegetables",
        icon: "🥬",
        topics: ["vegetables"],
      },
      {
        code: "DEIER",
        file: "DEIER.json",
        titleLb: "Déieren",
        titleEn: "Animals",
        icon: "🐾",
        topics: ["animals"],
      },
      {
        code: "MUSEKSINSTRUMENT",
        file: "MUSEKSINSTRUMENT.json",
        titleLb: "Instrumenter",
        titleEn: "Instruments",
        icon: "🎵",
        topics: ["music", "instruments"],
      },
      {
        code: "ANAT",
        file: "ANAT.json",
        titleLb: "Kierper",
        titleEn: "Body Parts",
        icon: "🫀",
        topics: ["body parts", "anatomy", "health"],
      },
    ],
  },
  {
    id: "lu-unit-6",
    title: "Alldaag — Everyday Life",
    description: "Vehicles, sports, holidays, and measurements in Luxembourgish",
    order: 6,
    categories: [
      {
        code: "GEFIER",
        file: "GEFIER.json",
        titleLb: "Gefierer",
        titleEn: "Vehicles",
        icon: "🚗",
        topics: ["vehicles", "transportation", "travel"],
      },
      {
        code: "SPORT",
        file: "SPORT.json",
        titleLb: "Sport",
        titleEn: "Sports",
        icon: "⚽",
        topics: ["sports", "athletics", "games"],
      },
      {
        code: "FEIERDEEG",
        file: "FEIERDEEG.json",
        titleLb: "Feierdeeg",
        titleEn: "Holidays",
        icon: "🎉",
        topics: ["holidays", "celebrations", "traditions"],
      },
      {
        code: "MOOSSEENHEET",
        file: "MOOSSEENHEET.json",
        titleLb: "Moosseenheeten",
        titleEn: "Measurements",
        icon: "📏",
        topics: ["measurements", "units", "numbers"],
      },
    ],
  },
];

// ─── Build Lessons ───────────────────────────────────────────────────────

interface LessonDef {
  id: string;
  unitId: string;
  title: string;
  description: string;
  icon: string;
  words: Word[];
  topics: string[];
}

let lessonCounter = 6; // existing lessons are 1-5

function buildLessonsForCategory(
  cat: CatSpec,
  unitId: string,
  wordsPerLesson: number = 8
): LessonDef[] {
  const words = getA1InCategory(cat.file, cat.code);
  if (words.length === 0) return [];

  console.log(`  ${cat.code}: ${words.length} A1 words found`);

  const chunks = chunk(words, wordsPerLesson);
  return chunks.map((chunkWords, i) => {
    const num = chunks.length > 1 ? ` ${i + 1}` : "";
    const id = `lu-lesson-${lessonCounter++}`;
    return {
      id,
      unitId,
      title: `${cat.titleLb}${num} — ${cat.titleEn}${num}`,
      description: `Learn ${cat.titleEn.toLowerCase()} vocabulary in Luxembourgish`,
      icon: cat.icon,
      words: chunkWords,
      topics: cat.topics,
    };
  });
}

// Special handling: merge small categories (DEIER + MUSEKSINSTRUMENT)
function buildUnit5Lessons(): LessonDef[] {
  const unit = UNIT_SPECS.find((u) => u.id === "lu-unit-5")!;
  const lessons: LessonDef[] = [];

  // Process UEBST, GEMEIS, ANAT normally
  for (const cat of unit.categories) {
    if (cat.code === "DEIER" || cat.code === "MUSEKSINSTRUMENT") continue;
    lessons.push(...buildLessonsForCategory(cat, unit.id));
  }

  // Merge DEIER + MUSEKSINSTRUMENT
  const deierCat = unit.categories.find((c) => c.code === "DEIER")!;
  const instrCat = unit.categories.find((c) => c.code === "MUSEKSINSTRUMENT")!;
  const deierWords = getA1InCategory(deierCat.file, deierCat.code);
  const instrWords = getA1InCategory(instrCat.file, instrCat.code);
  const merged = [...deierWords, ...instrWords];

  console.log(
    `  DEIER: ${deierWords.length}, MUSEKSINSTRUMENT: ${instrWords.length} → merged ${merged.length}`
  );

  if (merged.length > 0) {
    const chunks = chunk(merged, 8);
    for (let i = 0; i < chunks.length; i++) {
      const num = chunks.length > 1 ? ` ${i + 1}` : "";
      const id = `lu-lesson-${lessonCounter++}`;
      lessons.push({
        id,
        unitId: unit.id,
        title: `Déieren${num} — Animals${num}`,
        description: "Learn animal and music vocabulary in Luxembourgish",
        icon: "🐾",
        words: chunks[i],
        topics: ["animals", "music"],
      });
    }
  }

  return lessons;
}

// ─── Generate all lessons ────────────────────────────────────────────────

const allLessons: LessonDef[] = [];
const unitLessonIds: Record<string, string[]> = {};

for (const unit of UNIT_SPECS) {
  console.log(`\nUnit: ${unit.title}`);
  unitLessonIds[unit.id] = [];

  let lessons: LessonDef[];
  if (unit.id === "lu-unit-5") {
    lessons = buildUnit5Lessons();
  } else {
    lessons = [];
    for (const cat of unit.categories) {
      lessons.push(...buildLessonsForCategory(cat, unit.id));
    }
  }

  for (const l of lessons) {
    allLessons.push(l);
    unitLessonIds[unit.id].push(l.id);
  }
}

console.log(`\nTotal lessons: ${allLessons.length}`);
console.log(
  `Total vocabulary: ${allLessons.reduce((s, l) => s + l.words.length, 0)}`
);

// ─── Generate lodLessons.ts ──────────────────────────────────────────────

function genVocab(w: Word): string {
  const lines = [
    `      {`,
    `        word: "${escapeStr(w.word_lb)}",`,
    `        translation: "${escapeStr(w.en)}",`,
    `        pronunciation: "${escapeStr(w.ipa)}",`,
    `        emoji: "${escapeStr(w.emoji)}",`,
  ];
  if (w.lod_id) {
    lines.push(`        audioId: "${escapeStr(w.lod_id)}",`);
  }
  // Emit multi-language translations map
  const trParts = [`en: "${escapeStr(w.en)}"`];
  if (w.fr) trParts.push(`fr: "${escapeStr(w.fr)}"`);
  if (w.de) trParts.push(`de: "${escapeStr(w.de)}"`);
  if (w.pt) trParts.push(`pt: "${escapeStr(w.pt)}"`);
  lines.push(`        translations: { ${trParts.join(", ")} },`);
  lines.push(`      }`);
  return lines.join("\n");
}

function genAiPrompt(lesson: LessonDef): string {
  const wordList = lesson.words.map((w) => w.word_lb).join(", ");
  const topicStr = lesson.topics.join(", ");
  return [
    `    aiTeacherPrompt: {`,
    `      systemPrompt:`,
    `        "You're Luna, a friendly Luxembourgish teacher in a real back-and-forth voice lesson about ${topicStr} vocabulary. This is INTERACTIVE — not a lecture. Introduce ONE word at a time: say it, give the English meaning, add a quick pronunciation tip, then END YOUR TURN and wait for the student. Keep every reply to one or two sentences. Stay strictly within the lesson vocabulary: ${escapeStr(wordList)}.",`,
    `      introMessage:`,
    `        "Moien! Haut léiere mir ${lesson.title.split(" — ")[0]} op Lëtzebuergesch!",`,
    `      topics: [${lesson.topics.map((t) => `"${escapeStr(t)}"`).join(", ")}],`,
    `    }`,
  ].join("\n");
}

function genLesson(lesson: LessonDef): string {
  const vocabCount = lesson.words.length;
  return [
    `  {`,
    `    id: "${lesson.id}",`,
    `    unitId: "${lesson.unitId}",`,
    `    title: "${escapeStr(lesson.title)}",`,
    `    description: "${escapeStr(lesson.description)}",`,
    `    icon: "${escapeStr(lesson.icon)}",`,
    `    xpReward: 10,`,
    `    goals: [`,
    `      { description: "Learn ${vocabCount} vocabulary words", xpReward: 5 },`,
    `      { description: "Complete all exercises", xpReward: 5 },`,
    `    ],`,
    `    vocabulary: [`,
    lesson.words.map(genVocab).join(",\n"),
    `    ],`,
    `    phrases: [],`,
    `    activities: [],`,
    genAiPrompt(lesson),
    `  }`,
  ].join("\n");
}

const lessonsFile = [
  `import { Lesson } from "@/types/learning";`,
  ``,
  `export const LOD_LESSONS: Lesson[] = [`,
  allLessons.map(genLesson).join(",\n\n"),
  `];`,
  ``,
].join("\n");

fs.writeFileSync(path.join(OUT_DIR, "lodLessons.ts"), lessonsFile, "utf-8");
console.log(`\nWrote data/lodLessons.ts (${allLessons.length} lessons)`);

// ─── Generate lodUnits.ts ────────────────────────────────────────────────

function genUnit(unit: UnitSpec): string {
  const ids = unitLessonIds[unit.id] || [];
  if (ids.length === 0) return "";
  return [
    `  {`,
    `    id: "${unit.id}",`,
    `    languageCode: "lu",`,
    `    title: "${escapeStr(unit.title)}",`,
    `    description: "${escapeStr(unit.description)}",`,
    `    order: ${unit.order},`,
    `    lessonIds: [`,
    ids.map((id) => `      "${id}"`).join(",\n"),
    `    ],`,
    `  }`,
  ].join("\n");
}

const unitsWithLessons = UNIT_SPECS.filter(
  (u) => (unitLessonIds[u.id] || []).length > 0
);

const unitsFile = [
  `import { Unit } from "@/types/learning";`,
  ``,
  `export const LOD_UNITS: Unit[] = [`,
  unitsWithLessons.map(genUnit).join(",\n\n"),
  `];`,
  ``,
].join("\n");

fs.writeFileSync(path.join(OUT_DIR, "lodUnits.ts"), unitsFile, "utf-8");
console.log(`Wrote data/lodUnits.ts (${unitsWithLessons.length} units)`);

// ─── Generate lodMatchingPairs.ts ────────────────────────────────────────

function genMatchingPairs(lesson: LessonDef): string {
  const pairs = lesson.words.slice(0, 5);
  if (pairs.length < 3) return "";
  return [
    `  "${lesson.id}": [`,
    `    [`,
    pairs
      .map((w) => {
        const extras: string[] = [];
        if (w.fr) extras.push(`fr: "${escapeStr(w.fr)}"`);
        if (w.de) extras.push(`de: "${escapeStr(w.de)}"`);
        if (w.pt) extras.push(`pt: "${escapeStr(w.pt)}"`);
        const extraStr = extras.length > 0 ? `, ${extras.join(", ")}` : "";
        return `      { english: "${escapeStr(w.en)}", luxembourgish: "${escapeStr(w.word_lb)}"${extraStr} }`;
      })
      .join(",\n"),
    `    ],`,
    `  ]`,
  ].join("\n");
}

const pairsEntries = allLessons
  .map(genMatchingPairs)
  .filter((s) => s.length > 0);

const pairsFile = [
  `import type { MatchingPairConfig } from "./matchingPairs";`,
  ``,
  `export const LOD_MATCHING_PAIRS: Record<string, MatchingPairConfig[][]> = {`,
  pairsEntries.join(",\n\n"),
  `};`,
  ``,
].join("\n");

fs.writeFileSync(
  path.join(OUT_DIR, "lodMatchingPairs.ts"),
  pairsFile,
  "utf-8"
);
console.log(
  `Wrote data/lodMatchingPairs.ts (${pairsEntries.length} lesson entries)`
);

// ─── Copy & convert audio files ──────────────────────────────────────

if (!fs.existsSync(AUDIO_OUT_DIR)) {
  fs.mkdirSync(AUDIO_OUT_DIR, { recursive: true });
}

// Collect all lod_ids from generated lessons
const allAudioIds = new Set<string>();
for (const lesson of allLessons) {
  for (const w of lesson.words) {
    if (w.lod_id) allAudioIds.add(w.lod_id);
  }
}

// Additional audio IDs for hand-crafted Unit 1 vocabulary
const HAND_CRAFTED_AUDIO_IDS = [
  "MOIEN1", "ADDI1", "MERCI1", "KAFFI1", "TEI1", "WAASSER2",
  "BROUT1", "KUCH1", "MELLECH1", "PARDON1", "NUMM1", "GUTT2", "ZOCKER1",
];
for (const id of HAND_CRAFTED_AUDIO_IDS) allAudioIds.add(id);

console.log(`\nConverting ${allAudioIds.size} audio files (.ogg → .mp3)…`);
let converted = 0;
let skipped = 0;
let missing = 0;

for (const audioId of allAudioIds) {
  const src = path.join(AUDIO_SRC_DIR, `${audioId}.ogg`);
  const dst = path.join(AUDIO_OUT_DIR, `${audioId}.mp3`);

  if (!fs.existsSync(src)) {
    console.warn(`  ⚠ Missing: ${audioId}.ogg`);
    missing++;
    allAudioIds.delete(audioId);
    continue;
  }

  if (fs.existsSync(dst)) {
    skipped++;
    continue;
  }

  try {
    execSync(`ffmpeg -y -i "${src}" -codec:a libmp3lame -q:a 6 "${dst}" 2>/dev/null`);
    converted++;
  } catch (e) {
    console.warn(`  ⚠ Failed to convert: ${audioId}.ogg`);
    allAudioIds.delete(audioId);
  }
}

console.log(`  Converted: ${converted}, Skipped (existing): ${skipped}, Missing: ${missing}`);

// ─── Generate audioMap.ts ────────────────────────────────────────────

const sortedIds = [...allAudioIds].sort();
const audioMapLines = sortedIds.map(
  (id) => `  "${id}": require("@/assets/audio/${id}.mp3")`
);

const audioMapFile = [
  `export const AUDIO_FILES: Record<string, any> = {`,
  audioMapLines.join(",\n"),
  `};`,
  ``,
].join("\n");

fs.writeFileSync(path.join(OUT_DIR, "audioMap.ts"), audioMapFile, "utf-8");
console.log(`Wrote data/audioMap.ts (${sortedIds.length} entries)`);

// ─── Summary ─────────────────────────────────────────────────────────────

console.log("\n═══ Summary ═══");
for (const unit of unitsWithLessons) {
  const ids = unitLessonIds[unit.id];
  console.log(`${unit.title}: ${ids.length} lessons`);
  for (const id of ids) {
    const l = allLessons.find((ll) => ll.id === id)!;
    console.log(`  ${id}: "${l.title}" (${l.words.length} words)`);
  }
}
