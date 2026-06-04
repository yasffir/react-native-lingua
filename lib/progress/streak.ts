import { parseDateKey, toDateKey } from "@/lib/progress/dates";

/** Updates streak based on last activity date (YYYY-MM-DD). */
export function calculateNextStreak(
  lastActivityDate: string | null,
  currentStreak: number
): number {
  const today = toDateKey(new Date());
  if (!lastActivityDate) return 1;
  if (lastActivityDate === today) return Math.max(currentStreak, 1);

  const last = parseDateKey(lastActivityDate);
  const now = parseDateKey(today);
  const diffDays = Math.round(
    (now.getTime() - last.getTime()) / 86400000
  );

  if (diffDays === 1) return Math.max(currentStreak, 0) + 1;
  return 1;
}
