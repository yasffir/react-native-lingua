import { resolveVocabularyTranslations } from "@/lib/translation";
import { fillInBlankStepFromConfig } from "@/lib/lessonExercises/buildFillInBlankSteps";
import { chatStepFromConfig } from "@/lib/lessonExercises/buildChatSteps";
import { matchingPairsStepFromConfig } from "@/lib/lessonExercises/buildMatchingPairsSteps";
import { buildFlashcardSpeakSteps } from "@/lib/lessonExercises/buildFlashcardSpeakSteps";
import { buildPictureMatchSteps } from "@/lib/pictureMatch/buildSteps";
import { buildSelectTranslationSteps } from "@/lib/lessonExercises/buildSelectTranslationSteps";
import { translationStepFromConfig } from "@/lib/lessonExercises/buildTranslationSteps";
import { shuffle } from "@/lib/lessonExercises/shuffle";
import type { Lesson, TranslationLanguage } from "@/types/learning";
import type {
  ExerciseStepTemplate,
  MatchingPairsTemplateConfig,
  VocabDerivedTemplateConfig,
} from "@/types/exerciseTemplate";
import type { LessonExerciseStep } from "@/types/lessonExercise";
import type { ChatDialogueConfig } from "@/data/chatDialogues";
import type { FillInBlankConfig } from "@/data/fillInBlank";
import type { TranslationSentenceConfig } from "@/data/translationSentences";

const MAX_TOTAL_STEPS = 12;

function expandVocabDerived(
  lesson: Lesson,
  config: VocabDerivedTemplateConfig,
  translationLang: TranslationLanguage
): LessonExerciseStep[] {
  const maxPicture = config.maxPicture ?? 3;
  const maxSelect = config.maxSelect ?? 4;
  const maxFlashcard = config.maxFlashcard ?? 3;

  const picture = shuffle(buildPictureMatchSteps(lesson))
    .slice(0, maxPicture)
    .map(
      (step) =>
        ({ type: "picture_match", ...step }) satisfies LessonExerciseStep
    );

  const select = buildSelectTranslationSteps(lesson, translationLang).slice(
    0,
    maxSelect
  );
  const flashcard = buildFlashcardSpeakSteps(lesson, translationLang).slice(
    0,
    maxFlashcard
  );

  return [...picture, ...select, ...flashcard];
}

/** Build a mixed lesson session from DB or local templates. */
export function assembleLessonSteps(
  lesson: Lesson,
  templates: ExerciseStepTemplate[],
  translationLang: TranslationLanguage = "en"
): LessonExerciseStep[] {
  if (templates.length === 0) return [];

  const resolvedLesson: Lesson = {
    ...lesson,
    vocabulary: resolveVocabularyTranslations(
      lesson.vocabulary,
      translationLang
    ),
  };

  const sorted = [...templates].sort((a, b) => a.sortOrder - b.sortOrder);
  const steps: LessonExerciseStep[] = [];

  let fillIndex = 0;
  let chatIndex = 0;
  let translateIndex = 0;
  let matchIndex = 0;

  for (const template of sorted) {
    switch (template.stepType) {
      case "fill_in_blank":
        steps.push(
          fillInBlankStepFromConfig(
            lesson.id,
            template.config as FillInBlankConfig,
            fillIndex++,
            resolvedLesson.vocabulary
          )
        );
        break;
      case "complete_chat":
        steps.push(
          chatStepFromConfig(
            resolvedLesson.id,
            template.config as ChatDialogueConfig,
            chatIndex++,
            resolvedLesson.vocabulary
          )
        );
        break;
      case "vocab_derived":
        steps.push(
          ...expandVocabDerived(
            resolvedLesson,
            template.config as VocabDerivedTemplateConfig,
            translationLang
          )
        );
        break;
      case "translate":
        steps.push(
          translationStepFromConfig(
            lesson.id,
            template.config as TranslationSentenceConfig,
            translateIndex++
          )
        );
        break;
      case "matching_pairs":
        steps.push(
          matchingPairsStepFromConfig(
            lesson.id,
            template.config as MatchingPairsTemplateConfig,
            matchIndex++,
            translationLang
          )
        );
        break;
      default:
        break;
    }
  }

  const combined = shuffle(steps);
  return combined.slice(0, MAX_TOTAL_STEPS);
}
