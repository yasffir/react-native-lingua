/** Cached after first Supabase progress call — avoids repeated failed queries. */
export type ProgressSchemaSupport = {
  lastActivityDate: boolean;
  xpDaily: boolean;
  achievements: boolean;
};

/** Before any probe: try full schema; flip flags off when PostgREST reports missing objects. */
const OPTIMISTIC: ProgressSchemaSupport = {
  lastActivityDate: true,
  xpDaily: true,
  achievements: true,
};

let support: ProgressSchemaSupport | null = null;

export function getProgressSchemaSupport(): ProgressSchemaSupport {
  return support ?? OPTIMISTIC;
}

export function markProgressSchemaSupport(
  patch: Partial<ProgressSchemaSupport>
): void {
  support = { ...getProgressSchemaSupport(), ...patch };
}

export function resetProgressSchemaSupport(): void {
  support = null;
}

export function isProgressSchemaError(
  error: { code?: string; message?: string } | null
): boolean {
  if (!error?.code) return false;
  return error.code === "42703" || error.code === "42P01" || error.code === "PGRST205";
}

export const PROGRESS_MIGRATION_HINT =
  "Run supabase/migrations/005_progress_tracking.sql in the Supabase SQL Editor, then reload the API schema.";

let migrationHintLogged = false;

export function logProgressMigrationHintOnce(): void {
  if (migrationHintLogged) return;
  migrationHintLogged = true;
  console.warn(`[useLearningProgress] ${PROGRESS_MIGRATION_HINT}`);
}
