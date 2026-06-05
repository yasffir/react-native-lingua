import type {
  TranslationLanguage,
  VocabularyItem,
} from "@/types/learning";

export interface TranslationLanguageMeta {
  code: TranslationLanguage;
  label: string;
  nativeLabel: string;
  flag: string;
}

export const TRANSLATION_LANGUAGES: TranslationLanguageMeta[] = [
  { code: "en", label: "English", nativeLabel: "English", flag: "🇬🇧" },
  { code: "fr", label: "French", nativeLabel: "Fran\u00e7ais", flag: "🇫🇷" },
  { code: "de", label: "German", nativeLabel: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Portuguese", nativeLabel: "Portugu\u00eas", flag: "🇵🇹" },
];

export function translationLanguageName(lang: TranslationLanguage): string {
  return (
    TRANSLATION_LANGUAGES.find((l) => l.code === lang)?.label ?? "English"
  );
}

export function resolveTranslation(
  item: VocabularyItem,
  lang: TranslationLanguage
): string {
  if (lang === "en" || !item.translations) return item.translation;
  return item.translations[lang] ?? item.translation;
}

export function resolveVocabularyTranslations(
  vocabulary: VocabularyItem[],
  lang: TranslationLanguage
): VocabularyItem[] {
  if (lang === "en") return vocabulary;
  return vocabulary.map((item) => ({
    ...item,
    translation: resolveTranslation(item, lang),
  }));
}
