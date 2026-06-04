import type { SupabaseClient } from "@supabase/supabase-js";

import { TABLES } from "@/lib/supabase/tables";
import { upsertUserRow, updateUserLanguage } from "@/lib/profile/userDb";

interface ClerkUserLike {
  id: string;
  primaryEmailAddress?: { emailAddress: string } | null;
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  imageUrl?: string;
}

export async function upsertProfileFromClerk(
  supabase: SupabaseClient,
  user: ClerkUserLike,
  preferredLanguage?: string | null
): Promise<void> {
  await upsertUserRow(supabase, {
    clerk_user_id: user.id,
    email: user.primaryEmailAddress?.emailAddress ?? null,
    first_name: user.firstName ?? null,
    last_name: user.lastName ?? null,
    username: user.username ?? null,
    image_url: user.imageUrl ?? null,
    preferred_language: preferredLanguage ?? null,
    updated_at: new Date().toISOString(),
  });

  const { error: statsError } = await supabase.from(TABLES.userLearningStats).upsert(
    {
      clerk_user_id: user.id,
      xp_today: 0,
      daily_goal: 20,
      streak: 0,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "clerk_user_id", ignoreDuplicates: true }
  );

  if (statsError) throw statsError;
}

export async function updatePreferredLanguage(
  supabase: SupabaseClient,
  clerkUserId: string,
  languageCode: string
): Promise<void> {
  await updateUserLanguage(supabase, clerkUserId, languageCode);
}
