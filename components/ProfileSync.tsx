import { useAuth, useUser } from "@clerk/expo";
import { useEffect, useRef } from "react";

import { useSupabase } from "@/hooks/useSupabase";
import { isSupabaseConfigured } from "@/lib/config";
import {
  updatePreferredLanguage,
  upsertProfileFromClerk,
} from "@/lib/profile/sync";
import { useLanguageStore } from "@/store/languageStore";

/** Keeps Supabase user row in sync when signed in (webhook backup). */
export function ProfileSync() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const supabase = useSupabase();
  const { selectedLanguage } = useLanguageStore();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !isLoaded ||
      !userLoaded ||
      !isSignedIn ||
      !user?.id ||
      !isSupabaseConfigured ||
      !supabase
    ) {
      syncedRef.current = null;
      return;
    }

    if (syncedRef.current === user.id) return;
    syncedRef.current = user.id;

    upsertProfileFromClerk(supabase, user, selectedLanguage).catch((err) => {
      console.warn("[ProfileSync] upsert failed:", err);
      syncedRef.current = null;
    });
  }, [
    isLoaded,
    userLoaded,
    isSignedIn,
    user?.id,
    supabase,
    selectedLanguage,
  ]);

  useEffect(() => {
    if (
      !isLoaded ||
      !userLoaded ||
      !isSignedIn ||
      !user?.id ||
      !selectedLanguage ||
      !isSupabaseConfigured ||
      !supabase
    ) {
      return;
    }

    updatePreferredLanguage(supabase, user.id, selectedLanguage).catch((err) => {
      console.warn("[ProfileSync] preferred_language update failed:", err);
    });
  }, [
    isLoaded,
    userLoaded,
    isSignedIn,
    user?.id,
    selectedLanguage,
    supabase,
  ]);

  return null;
}
