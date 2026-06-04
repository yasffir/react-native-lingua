import { patchClerkUser } from "@/lib/clerk/backend-user";
import { getBearerToken, verifyClerkToken } from "@/lib/clerk/verify-token";
import { upsertUserRow } from "@/lib/profile/userDb";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

type UpdateUserBody = {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  preferredLanguage?: string | null;
};

export async function PATCH(request: Request): Promise<Response> {
  const clerkToken = getBearerToken(request);
  if (!clerkToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (!publishableKey) {
    return Response.json({ error: "Auth not configured" }, { status: 500 });
  }

  const userId = await verifyClerkToken(clerkToken, publishableKey);
  if (!userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: UpdateUserBody;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  try {
    if (process.env.CLERK_SECRET_KEY) {
      await patchClerkUser(userId, {
        firstName: body.firstName,
        lastName: body.lastName,
        username: body.username,
      });
    }

    const supabase = getSupabaseAdmin();
    await upsertUserRow(supabase, {
      clerk_user_id: userId,
      first_name: body.firstName?.trim() || null,
      last_name: body.lastName?.trim() || null,
      username: body.username?.trim() || null,
      bio: body.bio?.trim() || null,
      preferred_language: body.preferredLanguage ?? null,
      updated_at: new Date().toISOString(),
    });

    return Response.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Update failed";
    console.error("[api/user] PATCH failed:", message);
    return Response.json({ error: message }, { status: 422 });
  }
}
