import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { TABLES } from "@/lib/supabase/tables";
import { Webhook } from "svix";

type ClerkEmailAddress = { email_address: string };
type ClerkUserPayload = {
  id: string;
  email_addresses?: ClerkEmailAddress[];
  first_name?: string | null;
  last_name?: string | null;
  username?: string | null;
  image_url?: string | null;
};

type ClerkWebhookEvent = {
  type: string;
  data: ClerkUserPayload;
};

export async function POST(request: Request): Promise<Response> {
  const secret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
  if (!secret) {
    return Response.json(
      { error: "CLERK_WEBHOOK_SIGNING_SECRET not configured" },
      { status: 500 }
    );
  }

  const payload = await request.text();
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return Response.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  let event: ClerkWebhookEvent;
  try {
    const wh = new Webhook(secret);
    event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;
  } catch (err) {
    console.error("[clerk-webhook] Verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { type, data } = event;

  try {
    if (type === "user.created" || type === "user.updated") {
      const email = data.email_addresses?.[0]?.email_address ?? null;
      const { error: userError } = await supabase.from(TABLES.users).upsert(
        {
          clerk_user_id: data.id,
          email,
          first_name: data.first_name ?? null,
          last_name: data.last_name ?? null,
          username: data.username ?? null,
          image_url: data.image_url ?? null,
        },
        { onConflict: "clerk_user_id" }
      );
      if (userError) throw userError;

      if (type === "user.created") {
        const { error: statsError } = await supabase
          .from(TABLES.userLearningStats)
          .upsert(
            {
              clerk_user_id: data.id,
              xp_today: 0,
              daily_goal: 20,
              streak: 0,
            },
            { onConflict: "clerk_user_id", ignoreDuplicates: true }
          );
        if (statsError) throw statsError;
      }
    }

    if (type === "user.deleted") {
      const { error } = await supabase
        .from(TABLES.users)
        .delete()
        .eq("clerk_user_id", data.id);
      if (error) throw error;
    }

    return Response.json({ received: true });
  } catch (err) {
    console.error("[clerk-webhook] Handler error:", err);
    return Response.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
