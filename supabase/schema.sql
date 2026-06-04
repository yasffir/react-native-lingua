-- Lingua: Supabase schema (run in SQL Editor or via Supabase CLI)

-- ─── Curriculum (seeded from data/*.ts) ───────────────────────────────────

create table if not exists languages (
  code text primary key,
  name text not null,
  native_name text not null,
  flag text not null,
  color text not null,
  learners text not null
);

create table if not exists units (
  id text primary key,
  language_code text not null references languages (code) on delete cascade,
  title text not null,
  description text not null,
  order_index int not null,
  lesson_ids text[] not null default '{}'
);

create table if not exists lessons (
  id text primary key,
  unit_id text not null references units (id) on delete cascade,
  title text not null,
  description text not null,
  icon text not null,
  xp_reward int not null default 10,
  goals jsonb not null default '[]',
  vocabulary jsonb not null default '[]',
  phrases jsonb not null default '[]',
  activities jsonb not null default '[]',
  ai_teacher_prompt jsonb not null
);

-- ─── Users (synced from Clerk webhooks + profile screen edits) ─────────────

create table if not exists users (
  clerk_user_id text primary key,
  email text,
  first_name text,
  last_name text,
  username text,
  bio text,
  image_url text,
  preferred_language text references languages (code),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists users_username_unique
  on users (username)
  where username is not null;

create or replace function set_users_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on users;
create trigger users_set_updated_at
  before update on users
  for each row
  execute function set_users_updated_at();

create table if not exists user_learning_stats (
  clerk_user_id text primary key references users (clerk_user_id) on delete cascade,
  xp_today int not null default 0,
  daily_goal int not null default 20,
  streak int not null default 0,
  total_xp int not null default 0,
  last_activity_date date,
  updated_at timestamptz not null default now()
);

create table if not exists xp_daily (
  clerk_user_id text not null references users (clerk_user_id) on delete cascade,
  day date not null,
  xp int not null default 0 check (xp >= 0),
  primary key (clerk_user_id, day)
);

create index if not exists xp_daily_user_day_idx
  on xp_daily (clerk_user_id, day desc);

create table if not exists user_achievements (
  clerk_user_id text not null references users (clerk_user_id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (clerk_user_id, achievement_id)
);

create table if not exists lesson_completions (
  id uuid primary key default gen_random_uuid(),
  clerk_user_id text not null references users (clerk_user_id) on delete cascade,
  lesson_id text not null references lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (clerk_user_id, lesson_id)
);

create index if not exists lesson_completions_user_idx
  on lesson_completions (clerk_user_id);

-- ─── Row Level Security ─────────────────────────────────────────────────────

alter table languages enable row level security;
alter table units enable row level security;
alter table lessons enable row level security;
alter table users enable row level security;
alter table user_learning_stats enable row level security;
alter table xp_daily enable row level security;
alter table user_achievements enable row level security;
alter table lesson_completions enable row level security;

-- Public read for curriculum
drop policy if exists "languages_public_read" on languages;
create policy "languages_public_read" on languages for select using (true);

drop policy if exists "units_public_read" on units;
create policy "units_public_read" on units for select using (true);

drop policy if exists "lessons_public_read" on lessons;
create policy "lessons_public_read" on lessons for select using (true);

-- Users: read/update own row (Clerk JWT sub = clerk_user_id)
drop policy if exists "users_select_own" on users;
create policy "users_select_own" on users
  for select using (auth.jwt() ->> 'sub' = clerk_user_id);

drop policy if exists "users_update_own" on users;
create policy "users_update_own" on users
  for update using (auth.jwt() ->> 'sub' = clerk_user_id);

drop policy if exists "users_insert_own" on users;
create policy "users_insert_own" on users
  for insert with check (auth.jwt() ->> 'sub' = clerk_user_id);

-- Learning stats
drop policy if exists "stats_select_own" on user_learning_stats;
create policy "stats_select_own" on user_learning_stats
  for select using (auth.jwt() ->> 'sub' = clerk_user_id);

drop policy if exists "stats_update_own" on user_learning_stats;
create policy "stats_update_own" on user_learning_stats
  for update using (auth.jwt() ->> 'sub' = clerk_user_id);

drop policy if exists "stats_insert_own" on user_learning_stats;
create policy "stats_insert_own" on user_learning_stats
  for insert with check (auth.jwt() ->> 'sub' = clerk_user_id);

-- Lesson completions
drop policy if exists "completions_select_own" on lesson_completions;
create policy "completions_select_own" on lesson_completions
  for select using (auth.jwt() ->> 'sub' = clerk_user_id);

drop policy if exists "completions_insert_own" on lesson_completions;
create policy "completions_insert_own" on lesson_completions
  for insert with check (auth.jwt() ->> 'sub' = clerk_user_id);

-- Daily XP
drop policy if exists "xp_daily_select_own" on xp_daily;
create policy "xp_daily_select_own" on xp_daily
  for select using (auth.jwt() ->> 'sub' = clerk_user_id);

drop policy if exists "xp_daily_insert_own" on xp_daily;
create policy "xp_daily_insert_own" on xp_daily
  for insert with check (auth.jwt() ->> 'sub' = clerk_user_id);

drop policy if exists "xp_daily_update_own" on xp_daily;
create policy "xp_daily_update_own" on xp_daily
  for update using (auth.jwt() ->> 'sub' = clerk_user_id);

-- Achievements
drop policy if exists "achievements_select_own" on user_achievements;
create policy "achievements_select_own" on user_achievements
  for select using (auth.jwt() ->> 'sub' = clerk_user_id);

drop policy if exists "achievements_insert_own" on user_achievements;
create policy "achievements_insert_own" on user_achievements
  for insert with check (auth.jwt() ->> 'sub' = clerk_user_id);
