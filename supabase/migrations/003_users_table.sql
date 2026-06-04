-- App user table (Clerk sync + profile edits)
-- Run in Supabase SQL Editor after schema.sql (or on existing projects with `profiles`)

-- ─── 1. Rename legacy `profiles` → `users`, or create `users` ───────────────

alter table if exists public.profiles rename to users;

create table if not exists public.users (
  clerk_user_id text primary key,
  email text,
  first_name text,
  last_name text,
  username text,
  bio text,
  image_url text,
  preferred_language text references public.languages (code),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users add column if not exists username text;
alter table public.users add column if not exists bio text;
alter table public.users add column if not exists email text;
alter table public.users add column if not exists first_name text;
alter table public.users add column if not exists last_name text;
alter table public.users add column if not exists image_url text;
alter table public.users add column if not exists preferred_language text;
alter table public.users add column if not exists created_at timestamptz not null default now();
alter table public.users add column if not exists updated_at timestamptz not null default now();

create unique index if not exists users_username_unique
  on public.users (username)
  where username is not null;

-- ─── 2. Point learning tables at `users` ────────────────────────────────────

alter table public.user_learning_stats
  drop constraint if exists user_learning_stats_clerk_user_id_fkey;

alter table public.user_learning_stats
  add constraint user_learning_stats_clerk_user_id_fkey
  foreign key (clerk_user_id) references public.users (clerk_user_id) on delete cascade;

alter table public.lesson_completions
  drop constraint if exists lesson_completions_clerk_user_id_fkey;

alter table public.lesson_completions
  add constraint lesson_completions_clerk_user_id_fkey
  foreign key (clerk_user_id) references public.users (clerk_user_id) on delete cascade;

alter table public.user_learning_stats
  add column if not exists total_xp int not null default 0;

-- ─── 3. Auto-update `updated_at` on user edit ───────────────────────────────

create or replace function public.set_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at
  before update on public.users
  for each row
  execute function public.set_users_updated_at();

-- ─── 4. Row Level Security on `users` ───────────────────────────────────────

alter table public.users enable row level security;

drop policy if exists "profiles_select_own" on public.users;
drop policy if exists "profiles_update_own" on public.users;
drop policy if exists "profiles_insert_own" on public.users;
drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_update_own" on public.users;
drop policy if exists "users_insert_own" on public.users;

create policy "users_select_own" on public.users
  for select using (auth.jwt() ->> 'sub' = clerk_user_id);

create policy "users_update_own" on public.users
  for update using (auth.jwt() ->> 'sub' = clerk_user_id);

create policy "users_insert_own" on public.users
  for insert with check (auth.jwt() ->> 'sub' = clerk_user_id);
