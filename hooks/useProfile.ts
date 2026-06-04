import { useAuth, useUser } from "@clerk/expo";
import { useCallback, useEffect, useRef, useState } from "react";

import { isSupabaseConfigured } from "@/lib/config";
import { fetchUserRow, upsertUserRow } from "@/lib/profile/userDb";
import { useSupabase } from "@/hooks/useSupabase";

export interface UserProfile {
  clerkUserId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  bio: string | null;
  imageUrl: string | null;
  preferredLanguage: string | null;
  createdAt: string | null;
}

function isClerkParamError(err: unknown): boolean {
  const message = err instanceof Error ? err.message : String(err);
  return (
    message.includes("not a valid parameter") ||
    message.includes("form_param_unknown")
  );
}

export function useProfile() {
  const { isSignedIn, isLoaded: authLoaded, getToken } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();
  const supabase = useSupabase();
  const supabaseRef = useRef(supabase);
  supabaseRef.current = supabase;

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildFromClerk = useCallback((): UserProfile | null => {
    if (!user) return null;
    return {
      clerkUserId: user.id,
      email: user.primaryEmailAddress?.emailAddress ?? null,
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      username: user.username ?? null,
      bio: null,
      imageUrl: user.imageUrl ?? null,
      preferredLanguage: null,
      createdAt: user.createdAt?.toISOString() ?? null,
    };
  }, [user]);

  const refresh = useCallback(async () => {
    if (!authLoaded || !userLoaded) return;

    if (!isSignedIn || !user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const base = buildFromClerk();
    const client = supabaseRef.current;

    if (!isSupabaseConfigured || !client) {
      setProfile(base);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data } = await fetchUserRow(client, user.id);

      setProfile({
        clerkUserId: user.id,
        email: data?.email ?? base?.email ?? null,
        firstName: data?.first_name ?? base?.firstName ?? null,
        lastName: data?.last_name ?? base?.lastName ?? null,
        username: data?.username ?? base?.username ?? null,
        bio: data?.bio ?? null,
        imageUrl: data?.image_url ?? base?.imageUrl ?? null,
        preferredLanguage: data?.preferred_language ?? null,
        createdAt: data?.created_at ?? base?.createdAt ?? null,
      });
    } catch (e) {
      console.warn("[useProfile] fetch failed:", e);
      setProfile(base);
      setError(e instanceof Error ? e.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [authLoaded, buildFromClerk, isSignedIn, user, userLoaded]);

  useEffect(() => {
    refresh();
  }, [refresh, supabase]);

  const saveProfile = useCallback(
    async (updates: {
      firstName: string;
      lastName: string;
      username: string;
      bio: string;
      preferredLanguage?: string | null;
    }) => {
      if (!user || !isSignedIn) return;

      setSaving(true);
      setError(null);

      const payload = {
        firstName: updates.firstName.trim(),
        lastName: updates.lastName.trim(),
        username: updates.username.trim(),
        bio: updates.bio.trim(),
        preferredLanguage: updates.preferredLanguage ?? null,
      };

      try {
        const token = await getToken();
        if (token) {
          const res = await fetch("/api/user", {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (res.ok) {
            await user.reload();
            await refresh();
            return;
          }

          const errBody = await res.json().catch(() => ({}));
          const apiMessage =
            typeof errBody.error === "string"
              ? errBody.error
              : "Could not save profile";
          throw new Error(apiMessage);
        }

        // Fallback: Clerk client (no username) + Supabase
        try {
          await user.update({
            firstName: payload.firstName || undefined,
            lastName: payload.lastName || undefined,
          });
        } catch (clerkErr) {
          if (!isClerkParamError(clerkErr)) throw clerkErr;
          console.warn(
            "[useProfile] Clerk name fields disabled in Dashboard — saved to database only"
          );
        }

        const client = supabaseRef.current;
        if (isSupabaseConfigured && client) {
          await upsertUserRow(client, {
            clerk_user_id: user.id,
            email: user.primaryEmailAddress?.emailAddress ?? null,
            first_name: payload.firstName || null,
            last_name: payload.lastName || null,
            username: payload.username || null,
            bio: payload.bio || null,
            image_url: user.imageUrl ?? null,
            preferred_language: payload.preferredLanguage,
            updated_at: new Date().toISOString(),
          });
        }

        await user.reload();
        await refresh();
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to save profile";
        setError(message);
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [getToken, isSignedIn, refresh, user]
  );

  return { profile, loading, saving, error, refresh, saveProfile };
}
