# Supabase + Clerk setup

This app stores **curriculum** (languages, units, lessons) and **user progress** in Supabase. Clerk webhooks keep the `profiles` table in sync.

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project.
2. Open **Project Settings → API** and copy:
   - Project URL → `EXPO_PUBLIC_SUPABASE_URL`
   - `anon` public key → `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server/seed only — never ship in the app)

Add them to your root `.env`.

## 2. Run the database schema (required before seed)

If `bun run seed:supabase` fails with **PGRST205** / `Could not find the table 'public.languages'`, the schema has not been applied yet.

1. [Supabase Dashboard](https://supabase.com/dashboard) → your project
2. **SQL Editor** → **New query**
3. Open `supabase/schema.sql` in this repo, copy **the entire file**, paste into the editor
4. **Run** — you should see “Success”
5. **Table Editor** — confirm tables exist: `languages`, `units`, `lessons`, **`users`**, `user_learning_stats`, `lesson_completions`

Only then run the seed (step 3).

**Existing projects:** run in order:

1. `supabase/migrations/003_users_table.sql`
2. `supabase/migrations/004_fix_user_columns.sql` (adds `username` / `bio`, copies `profiles` → `users`, reloads API schema)

If you see `column profiles.username does not exist` or `PGRST204`, run **004** and in Supabase go to **Project Settings → API → Reload schema** (or wait ~1 minute after `NOTIFY pgrst, 'reload schema'`).

## 3. Exercise templates table (migration 006)

Mixed lesson exercises (fill-in-blank, chat, matching pairs, etc.) live in **`exercise_step_templates`**.

| Stored in Supabase | Stored in app (bundled) |
|--------------------|-------------------------|
| `languages`, `units`, `lessons` (titles, vocab, phrases) | `assets/audio/` + `data/audioMap.ts` |
| `exercise_step_templates` (step type + JSON config) | Used as **fallback** when DB is empty or offline |
| `lesson_completions`, stats, achievements | — |

**Existing projects:** run `supabase/migrations/006_exercise_step_templates.sql` in the SQL Editor (or re-run full `schema.sql`), then seed.

## 4. Seed curriculum + exercises

From the project root (with `.env` loaded):

```bash
npm run seed:supabase
```

This uploads:

- `data/languages.ts`, `data/units.ts`, `data/lessons.ts`
- All exercise templates from `lib/curriculum/exerciseTemplates/collect.ts` (sourced from `data/fillInBlank.ts`, `chatDialogues.ts`, `matchingPairs.ts`, `translationSentences.ts`, plus auto-generated vocab steps per lesson)

Re-run the seed whenever you change local lesson or exercise files (including after regenerating LOD curriculum).

### Full GWS A1 curriculum (867 words)

The app can generate the complete [LOD GWS A1 vocabulary list](https://lod.lu/categories/category/GWS%20A1/1) (*Schwätzt Dir Lëtzebuergesch? – Niveau A1*) into `data/lodLessons.ts`, units, matching pairs, and exercise configs:

```bash
npm run generate:lod-lessons
npm run seed:supabase
```

This fetches live data from `https://lod.lu/api/lb`, caches entries under `data/lodCache/` (gitignored), and produces **117 LOD lessons** (+ 5 hand-crafted Unit 1 lessons = **122 total**). LOD pronunciation streams at runtime via each word’s `audioId`; Unit 1 keeps bundled MP3s in `assets/audio/`.

## 5. Clerk ↔ Supabase JWT (required for progress sync)

The app writes XP and lesson completions using Row Level Security. You need a Clerk JWT that Supabase accepts.

### Clerk (issue tokens)

1. **Clerk Dashboard** → **JWT Templates** → **New template** → **Supabase** preset.
2. Name the template exactly: `supabase`
3. Save. Clerk may show a **JWKS Public Key** (PEM block starting with `-----BEGIN PUBLIC KEY-----`). That is **public** — safe to use in Supabase, never commit private keys.

### Supabase (verify tokens)

1. **Supabase Dashboard** → **Authentication** → **Sign In / Up** → **Third-party** (or **JWT** / **Clerk** provider, depending on UI).
2. Enable **Clerk** and complete the wizard:
   - Prefer the **JWKS URL** if offered: `https://<your-clerk-frontend-api>/.well-known/jwks.json`  
     (find the host in Clerk → **API keys** / publishable key instance URL).
   - If the UI asks for a **static public key** instead, paste the full PEM from Clerk (including `BEGIN` / `END` lines).
3. Save.

### This repo

- **Do not** add the JWKS public key to `.env` or commit it in code.
- The app only calls `getToken({ template: "supabase" })` in `hooks/useSupabase.ts`; Supabase verifies the JWT server-side for RLS.

Without this template, lessons still load (public read), but progress may not save.

## 6. Clerk webhooks (profiles)

### Localhost does not work in Clerk

Clerk sends webhooks **from the cloud** to your endpoint. It cannot reach:

- `http://localhost:8081/api/clerk-webhook`
- `http://127.0.0.1/...`

Do **not** paste a localhost URL into the Clerk Dashboard — delivery will always fail.

### Option A — Skip webhooks on your machine (recommended)

For local development you usually **do not need** the webhook at all.

`components/ProfileSync.tsx` upserts `profiles` and default `user_learning_stats` when a signed-in user opens the app. That is enough to develop on localhost.

You can leave `CLERK_WEBHOOK_SIGNING_SECRET` empty until you deploy.

### Option B — Test webhooks locally with a tunnel

If you want Clerk → your Mac while developing:

1. Start the app with API routes available:
   ```bash
   npx expo start
   ```
2. In another terminal, expose the dev server (Metro/API is usually port **8081**):
   ```bash
   ngrok http 8081
   ```
3. In **Clerk Dashboard** → **Webhooks** → **Add endpoint**, use the **HTTPS** ngrok URL:
   ```text
   https://YOUR-NGROK-SUBDOMAIN.ngrok-free.app/api/clerk-webhook
   ```
   (not `localhost`)
4. Subscribe to: `user.created`, `user.updated`, `user.deleted`
5. Copy the **Signing secret** → `CLERK_WEBHOOK_SIGNING_SECRET` in `.env`
6. Send a test event from Clerk and confirm logs / rows in Supabase `profiles`

Replace `YOUR-NGROK-SUBDOMAIN` with the host ngrok prints (it changes each free session unless you use a fixed domain).

### Option C — Production / staging URL

After [EAS Hosting](https://docs.expo.dev/eas/hosting/) or another deploy:

```text
https://your-production-domain.com/api/clerk-webhook
```

The handler is `app/api/clerk-webhook+api.ts` — it upserts/deletes `profiles` and creates default stats on `user.created`.

## Tables overview

| Table | Purpose |
|-------|---------|
| `languages` | Luxembourgish (and future languages) |
| `units` | Course units per language |
| `lessons` | Full lesson JSON (vocabulary, activities, AI prompts) |
| `exercise_step_templates` | Mixed exercise configs per lesson (fill-in-blank, chat, matching pairs, vocab-derived) |
| `users` | Clerk user mirror (name, username, bio, language) |
| `user_learning_stats` | XP, streak, daily goal, `last_activity_date` |
| `xp_daily` | Per-day XP totals (7-day chart on profile) |
| `user_achievements` | Unlocked achievement IDs |
| `lesson_completions` | Completed lesson IDs per user |

### Migration 005 (progress tracking) — required for profile stats

If you see `column user_learning_stats.last_activity_date does not exist` in the app logs, run this in **Supabase → SQL Editor**:

1. Open `supabase/migrations/005_progress_tracking.sql`
2. Paste the full file and click **Run**
3. Confirm success (adds `last_activity_date`, `xp_daily`, `user_achievements`)

The migration ends with `notify pgrst, 'reload schema';` so the API picks up new tables immediately.

Until 005 is applied, the app still loads basic XP/streak from `user_learning_stats` only (no 7-day chart or persisted achievements).

## Fallback without Supabase

If `EXPO_PUBLIC_SUPABASE_URL` / anon key are missing, the app reads curriculum and exercise templates from bundled `data/*.ts` and keeps progress in memory only (no cloud sync).
