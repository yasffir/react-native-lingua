import type {
  AITeacherPrompt,
  Activity,
  LessonGoal,
  Phrase,
  VocabularyItem,
} from "@/types/learning";

export interface LanguageRow {
  code: string;
  name: string;
  native_name: string;
  flag: string;
  color: string;
  learners: string;
}

export interface UnitRow {
  id: string;
  language_code: string;
  title: string;
  description: string;
  order_index: number;
  lesson_ids: string[];
}

export interface LessonRow {
  id: string;
  unit_id: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  goals: LessonGoal[];
  vocabulary: VocabularyItem[];
  phrases: Phrase[];
  activities: Activity[];
  ai_teacher_prompt: AITeacherPrompt;
}

export interface ProfileRow {
  clerk_user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  image_url: string | null;
  preferred_language: string | null;
}

export interface UserLearningStatsRow {
  clerk_user_id: string;
  xp_today: number;
  daily_goal: number;
  streak: number;
}

export interface LessonCompletionRow {
  lesson_id: string;
  completed_at: string;
}
