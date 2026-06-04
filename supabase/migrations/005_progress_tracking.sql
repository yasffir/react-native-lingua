-- Real progress: daily XP log, streak date, achievements

alter table public.user_learning_stats
  add column if not exists last_activity_date date;

create table if not exists public.xp_daily (
  clerk_user_id text not null references public.users (clerk_user_id) on delete cascade,
  day date not null,
  xp int not null default 0 check (xp >= 0),
  primary key (clerk_user_id, day)
);

create index if not exists xp_daily_user_day_idx
  on public.xp_daily (clerk_user_id, day desc);

create table if not exists public.user_achievements (
  clerk_user_id text not null references public.users (clerk_user_id) on delete cascade,
  achievement_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (clerk_user_id, achievement_id)
);

alter table public.xp_daily enable row level security;
alter table public.user_achievements enable row level security;

drop policy if exists "xp_daily_select_own" on public.xp_daily;
create policy "xp_daily_select_own" on public.xp_daily
  for select using (auth.jwt() ->> 'sub' = clerk_user_id);

drop policy if exists "xp_daily_insert_own" on public.xp_daily;
create policy "xp_daily_insert_own" on public.xp_daily
  for insert with check (auth.jwt() ->> 'sub' = clerk_user_id);

drop policy if exists "xp_daily_update_own" on public.xp_daily;
create policy "xp_daily_update_own" on public.xp_daily
  for update using (auth.jwt() ->> 'sub' = clerk_user_id);

drop policy if exists "achievements_select_own" on public.user_achievements;
create policy "achievements_select_own" on public.user_achievements
  for select using (auth.jwt() ->> 'sub' = clerk_user_id);

drop policy if exists "achievements_insert_own" on public.user_achievements;
create policy "achievements_insert_own" on public.user_achievements
  for insert with check (auth.jwt() ->> 'sub' = clerk_user_id);

notify pgrst, 'reload schema';
