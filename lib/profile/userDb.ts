import type { SupabaseClient } from "@supabase/supabase-js";

/** Tables we support while migrating profiles → users */
const USER_TABLES = ["users", "profiles"] as const;

export type UserTableName = (typeof USER_TABLES)[number];

export interface UserRowPayload {
  clerk_user_id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  bio?: string | null;
  image_url?: string | null;
  preferred_language?: string | null;
  updated_at?: string;
}

function isMissingColumnError(error: { code?: string; message?: string }): boolean {
  return (
    error.code === "PGRST204" ||
    error.code === "42703" ||
    (error.message?.includes("does not exist") ?? false)
  );
}

function isMissingTableError(error: { code?: string; message?: string }): boolean {
  return error.code === "PGRST205" || (error.message?.includes("schema cache") ?? false);
}

/** Upsert into `users`, then `profiles`, stripping unknown columns if needed. */
export async function upsertUserRow(
  supabase: SupabaseClient,
  payload: UserRowPayload
): Promise<{ table: UserTableName }> {
  const attempts: UserRowPayload[] = [
    payload,
    {
      clerk_user_id: payload.clerk_user_id,
      email: payload.email,
      first_name: payload.first_name,
      last_name: payload.last_name,
      image_url: payload.image_url,
      preferred_language: payload.preferred_language,
      updated_at: payload.updated_at,
    },
  ];

  let lastError: { code?: string; message?: string } | null = null;

  for (const table of USER_TABLES) {
    for (const row of attempts) {
      const { error } = await supabase.from(table).upsert(row, {
        onConflict: "clerk_user_id",
      });
      if (!error) return { table };
      lastError = error;
      if (!isMissingColumnError(error)) break;
    }
    if (lastError && !isMissingTableError(lastError)) break;
  }

  throw lastError ?? new Error("Could not upsert user row");
}

const FULL_SELECT =
  "email, first_name, last_name, username, bio, image_url, preferred_language, created_at";
const BASE_SELECT =
  "email, first_name, last_name, image_url, preferred_language, created_at";

export type FetchedUserRow = {
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  username?: string | null;
  bio?: string | null;
  image_url: string | null;
  preferred_language: string | null;
  created_at: string | null;
};

/** Load user row from `users` or `profiles`. */
export async function fetchUserRow(
  supabase: SupabaseClient,
  clerkUserId: string
): Promise<{ data: FetchedUserRow | null; table: UserTableName | null }> {
  let lastError: { code?: string; message?: string } | null = null;

  for (const table of USER_TABLES) {
    for (const select of [FULL_SELECT, BASE_SELECT]) {
      const { data, error } = await supabase
        .from(table)
        .select(select)
        .eq("clerk_user_id", clerkUserId)
        .maybeSingle();

      if (!error) {
        return { data: data as FetchedUserRow | null, table };
      }
      lastError = error;
      if (!isMissingColumnError(error)) break;
    }
    if (lastError && !isMissingTableError(lastError)) break;
  }

  throw lastError ?? new Error("Could not fetch user row");
}

export async function updateUserLanguage(
  supabase: SupabaseClient,
  clerkUserId: string,
  languageCode: string
): Promise<void> {
  const patch = {
    preferred_language: languageCode,
    updated_at: new Date().toISOString(),
  };

  let lastError: { code?: string; message?: string } | null = null;

  for (const table of USER_TABLES) {
    const { error } = await supabase
      .from(table)
      .update(patch)
      .eq("clerk_user_id", clerkUserId);
    if (!error) return;
    lastError = error;
    if (!isMissingTableError(error)) break;
  }

  throw lastError ?? new Error("Could not update preferred_language");
}
