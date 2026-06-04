import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/config";

export function createSupabaseClient(
  getAccessToken?: () => Promise<string | null>
): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    accessToken: getAccessToken,
  });
}
