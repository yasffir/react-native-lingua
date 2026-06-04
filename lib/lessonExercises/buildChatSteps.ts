import { LESSON_CHAT_DIALOGUES } from "@/data/chatDialogues";
import { shuffle } from "@/lib/lessonExercises/shuffle";
import type { Lesson } from "@/types/learning";
import type {
  ChatReplyOption,
  CompleteChatExerciseStep,
  TranslationExplain,
} from "@/types/lessonExercise";

const MAX_CHAT_PER_LESSON = 2;

function toStep(
  lessonId: string,
  config: (typeof LESSON_CHAT_DIALOGUES)[string][number],
  index: number
): CompleteChatExerciseStep {
  const correct = config.options.find((o) => o.id === config.correctOptionId);
  const explain: TranslationExplain =
    config.explain ?? {
      highlightWord: correct?.text ?? config.prompt,
      meaning: `A natural reply is "${correct?.text}" (${correct?.translation}).`,
      examples: [config.prompt, correct?.text ?? ""].filter(Boolean),
    };

  const options: ChatReplyOption[] = shuffle(config.options).map((o) => ({
    id: o.id,
    text: o.text,
    translation: o.translation,
  }));

  return {
    type: "complete_chat",
    id: `${lessonId}-chat-${index}`,
    prompt: config.prompt,
    promptTranslation: config.promptTranslation,
    options,
    correctOptionId: config.correctOptionId,
    explain,
  };
}

export function buildChatSteps(lesson: Lesson): CompleteChatExerciseStep[] {
  const dialogues = LESSON_CHAT_DIALOGUES[lesson.id] ?? [];
  return shuffle(dialogues)
    .slice(0, MAX_CHAT_PER_LESSON)
    .map((config, index) => toStep(lesson.id, config, index));
}
