type ClerkApiError = {
  errors?: Array<{ long_message?: string; message?: string; code?: string }>;
};

export interface ClerkUserPatch {
  firstName?: string;
  lastName?: string;
  username?: string;
}

function formatClerkApiError(body: ClerkApiError): string {
  const first = body.errors?.[0];
  return (
    first?.long_message ??
    first?.message ??
    "Clerk could not update this profile"
  );
}

/** Updates the user via Clerk Backend API (supports username). */
export async function patchClerkUser(
  userId: string,
  patch: ClerkUserPatch
): Promise<void> {
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) {
    throw new Error("CLERK_SECRET_KEY is not configured");
  }

  const body: Record<string, string> = {};
  if (patch.firstName?.trim()) body.first_name = patch.firstName.trim();
  if (patch.lastName?.trim()) body.last_name = patch.lastName.trim();
  if (patch.username?.trim()) body.username = patch.username.trim();

  if (Object.keys(body).length === 0) return;

  const res = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errBody = (await res.json().catch(() => ({}))) as ClerkApiError;
    throw new Error(formatClerkApiError(errBody));
  }
}
