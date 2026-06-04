-- Fix: "column profiles.username does not exist" / ProfileSync PGRST204
-- Run this in Supabase SQL Editor, then reload the API schema (see below).

-- 1) Add profile columns on legacy `profiles` (if that table still exists)
alter table if exists public.profiles add column if not exists username text;
alter table if exists public.profiles add column if not exists bio text;
alter table if exists public.profiles add column if not exists preferred_language text;

-- 2) Ensure `users` exists with full shape
create table if not exists public.users (
  clerk_user_id text primary key,
  email text,
  first_name text,
  last_name text,
  username text,
  bio text,
  image_url text,
  preferred_language text,
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

-- 3) Copy rows from profiles → users (if profiles still exists)
do $$
begin
  if exists (
    select 1 from information_schema.tables
    where table_schema = 'public' and table_name = 'profiles'
  ) then
    insert into public.users (
      clerk_user_id, email, first_name, last_name, username, bio,
      image_url, preferred_language, created_at, updated_at
    )
    select
      clerk_user_id, email, first_name, last_name, username, bio,
      image_url, preferred_language, created_at, updated_at
    from public.profiles
    on conflict (clerk_user_id) do update set
      email = excluded.email,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      username = coalesce(excluded.username, public.users.username),
      bio = coalesce(excluded.bio, public.users.bio),
      image_url = excluded.image_url,
      preferred_language = coalesce(excluded.preferred_language, public.users.preferred_language),
      updated_at = now();
  end if;
end $$;

-- 4) Reload PostgREST schema cache (required after column changes)
notify pgrst, 'reload schema';
