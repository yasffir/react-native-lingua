import { Unit } from "@/types/learning";
import { LOD_UNITS } from "./lodUnits";

const HAND_CRAFTED: Unit[] = [
  {
    id: "lu-unit-1",
    languageCode: "lu",
    title: "Moien! — First steps",
    description: "Start your Luxembourgish journey with everyday phrases",
    order: 1,
    lessonIds: [
      "lu-lesson-1",
      "lu-lesson-2",
      "lu-lesson-3",
      "lu-lesson-4",
      "lu-lesson-5",
    ],
  },
];

export const UNITS: Unit[] = [...HAND_CRAFTED, ...LOD_UNITS];
