import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { LanguageCode, TranslationLanguage } from "@/types/learning";

interface LanguageState {
  selectedLanguage: LanguageCode | null;
  translationLanguage: TranslationLanguage;
  setSelectedLanguage: (code: LanguageCode) => void;
  setTranslationLanguage: (lang: TranslationLanguage) => void;
  clearSelectedLanguage: () => void;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      selectedLanguage: "lu",
      translationLanguage: "en",
      setSelectedLanguage: (code) => set({ selectedLanguage: code }),
      setTranslationLanguage: (lang) => set({ translationLanguage: lang }),
      clearSelectedLanguage: () => set({ selectedLanguage: "lu" }),
    }),
    {
      name: "language-storage",
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
      migrate: (persisted: any) => ({
        selectedLanguage: persisted?.selectedLanguage ?? ("lu" as const),
        translationLanguage:
          (persisted?.translationLanguage as TranslationLanguage) ?? "en",
      }),
    }
  )
);
