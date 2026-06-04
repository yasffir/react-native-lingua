import type {
  IncorrectAnswerFeedback,
  LessonExerciseStep,
} from "@/types/lessonExercise";

export function getIncorrectFeedback(
  step: LessonExerciseStep
): IncorrectAnswerFeedback {
  if (step.type === "picture_match") {
    const correctOption = step.options.find(
      (o) => o.id === step.correctOptionId
    );
    const word = step.promptWord;
    return {
      correctAnswer: /[.!?]$/.test(word) ? word : `${word}!`,
      meaning: correctOption?.label ?? step.promptTranslation,
    };
  }

  if (step.type === "complete_chat") {
    const correct = step.options.find((o) => o.id === step.correctOptionId);
    const text = correct?.text ?? "";
    return {
      correctAnswer: /[.!?]$/.test(text) ? text : `${text}`,
      meaning: correct?.translation ?? step.promptTranslation,
    };
  }

  if (step.type === "select_translation") {
    const correct = step.options.find((o) => o.id === step.correctOptionId);
    return {
      correctAnswer: correct?.text ?? step.correctOptionId,
      meaning: step.englishPrompt,
    };
  }

  if (step.type === "fill_in_blank") {
    return {
      correctAnswer: step.fullSentence,
      meaning: step.englishHint,
    };
  }

  if (step.type === "matching_pairs") {
    const pairs = step.pairs
      .map((p) => `${p.english} → ${p.luxembourgish}`)
      .join(" · ");
    return {
      correctAnswer: pairs,
      meaning: "Match each English tile to its Luxembourgish partner.",
    };
  }

  if (step.type !== "translate") {
    return { correctAnswer: "", meaning: "" };
  }

  const correctAnswer = step.correctWords.join(" ");
  return {
    correctAnswer: /[.!?]$/.test(correctAnswer)
      ? correctAnswer
      : `${correctAnswer}.`,
    meaning: step.sourceSentence,
  };
}

export function normalizeChipWord(word: string): string {
  return word.toLowerCase().replace(/[.,!?]/g, "").trim();
}

/** Per answer-slot: correct word at index vs what the user placed. */
export function getAnswerChipVariants(
  answerIds: string[],
  correctWords: string[],
  getText: (chipId: string) => string,
  phase: "pick" | "wrong" | "correct"
): ("answer" | "answerCorrect" | "answerIncorrect" | "answerPartial")[] {
  if (phase !== "wrong") {
    return answerIds.map(() =>
      phase === "correct" ? "answerCorrect" : "answer"
    );
  }

  return answerIds.map((chipId, index) => {
    const text = getText(chipId);
    const expected = correctWords[index];
    if (!expected) return "answerIncorrect";
    if (normalizeChipWord(text) === normalizeChipWord(expected)) {
      return "answerPartial";
    }
    return "answerIncorrect";
  });
}
