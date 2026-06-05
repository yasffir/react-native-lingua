-- Exercise step templates (authored content for mixed lesson sessions)

create table if not exists exercise_step_templates (
  id text primary key,
  lesson_id text not null references lessons (id) on delete cascade,
  step_type text not null,
  sort_order int not null default 0,
  config jsonb not null default '{}'
);

create index if not exists exercise_step_templates_lesson_idx
  on exercise_step_templates (lesson_id, sort_order);

alter table exercise_step_templates enable row level security;

drop policy if exists "exercise_templates_public_read" on exercise_step_templates;
create policy "exercise_templates_public_read" on exercise_step_templates
  for select using (true);
