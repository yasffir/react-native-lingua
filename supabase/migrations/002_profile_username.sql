-- Run in Supabase SQL Editor if profiles already exists without these columns

alter table profiles add column if not exists username text;
alter table profiles add column if not exists bio text;

create unique index if not exists profiles_username_unique
  on profiles (username)
  where username is not null;
