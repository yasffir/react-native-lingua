/** Supabase table names (single source of truth). */
export const TABLES = {
  users: "users",
  userLearningStats: "user_learning_stats",
  xpDaily: "xp_daily",
  userAchievements: "user_achievements",
  lessonCompletions: "lesson_completions",
  languages: "languages",
  units: "units",
  lessons: "lessons",
  exerciseStepTemplates: "exercise_step_templates",
} as const;
