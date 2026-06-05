import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { toDateKey } from "@/lib/progress/dates";

export type DailyPlanItemId = "lesson" | "ai-conversation" | "new-words";

interface DailyPlanState {
  dateKey: string;
  completed: Partial<Record<DailyPlanItemId, boolean>>;
  syncToday: () => void;
  markComplete: (id: DailyPlanItemId) => void;
  isItemComplete: (id: DailyPlanItemId) => boolean;
}

function todayKey(): string {
  return toDateKey(new Date());
}

export const useDailyPlanStore = create<DailyPlanState>()(
  persist(
    (set, get) => ({
      dateKey: todayKey(),
      completed: {},

      syncToday: () => {
        const current = todayKey();
        if (get().dateKey !== current) {
          set({ dateKey: current, completed: {} });
        }
      },

      markComplete: (id) => {
        const current = todayKey();
        const state = get();
        const completed =
          state.dateKey === current ? { ...state.completed } : {};
        completed[id] = true;
        set({ dateKey: current, completed });
      },

      isItemComplete: (id) => {
        get().syncToday();
        return Boolean(get().completed[id]);
      },
    }),
    {
      name: "daily-plan-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
