export interface AchievementDefinition {
  id: string;
  emoji: string;
  title: string;
  description: string;
  bgColor: string;
}

export const ACHIEVEMENTS: AchievementDefinition[] = [
  {
    id: "first_lesson",
    emoji: "📜",
    title: "First steps",
    description: "Complete your first lesson",
    bgColor: "#FEE2E2",
  },
  {
    id: "streak_3",
    emoji: "🔥",
    title: "On fire",
    description: "Reach a 3-day streak",
    bgColor: "#FEE2E2",
  },
  {
    id: "streak_7",
    emoji: "🔥",
    title: "Week warrior",
    description: "Reach a 7-day streak",
    bgColor: "#FFEDD5",
  },
  {
    id: "lessons_3",
    emoji: "🧙",
    title: "Curious learner",
    description: "Complete 3 lessons",
    bgColor: "#D1FAE5",
  },
  {
    id: "lessons_5",
    emoji: "⭐",
    title: "Dedicated",
    description: "Complete 5 lessons",
    bgColor: "#EDE9FE",
  },
  {
    id: "xp_50",
    emoji: "⚡",
    title: "XP spark",
    description: "Earn 50 total XP",
    bgColor: "#FEF9C3",
  },
  {
    id: "xp_100",
    emoji: "💎",
    title: "XP collector",
    description: "Earn 100 total XP",
    bgColor: "#DBEAFE",
  },
  {
    id: "daily_goal",
    emoji: "🎯",
    title: "Goal crusher",
    description: "Hit your daily XP goal",
    bgColor: "#D1FAE5",
  },
];
