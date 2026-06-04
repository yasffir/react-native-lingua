import { useAuth } from "@clerk/expo";
import { useMemo, useRef } from "react";

import { isSupabaseConfigured } from "@/lib/config";
import { createSupabaseClient } from "@/lib/supabase/client";

/**
 * Single Supabase client per signed-in session.
 * getToken is stored in a ref so Clerk re-renders do not recreate the client
 * (recreating it was causing useCurriculum / useLearningProgress refetch loops).
 */
export function useSupabase() {
  const { getToken, isSignedIn } = useAuth();
  const getTokenRef = useRef(getToken);
  getTokenRef.current = getToken;

  return useMemo(() => {
    if (!isSupabaseConfigured) return null;

    return createSupabaseClient(async () => {
      if (!isSignedIn) return null;
      try {
        return (
          (await getTokenRef.current({ template: "supabase" })) ?? null
        );
      } catch {
        return null;
      }
    });
  }, [isSignedIn]);
}
