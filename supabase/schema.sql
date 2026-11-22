-- HappyPlace cloud sync schema.
-- Paste this whole file into Supabase: SQL Editor -> New query -> Run.
-- Each row holds one person's HappyPlace profile. Row Level Security means a
-- signed-in account can only ever read, write or delete its own rows.

create table if not exists public.happyplace_profiles (
  user_id    uuid        not null default auth.uid() references auth.users (id) on delete cascade,
  profile_id text        not null check (char_length(profile_id) between 1 and 64),
  profile    jsonb       not null,
  data       jsonb       not null,
  updated_at timestamptz not null default now(),
  primary key (user_id, profile_id)
);

alter table public.happyplace_profiles enable row level security;

-- Signed-out visitors get nothing.
revoke all on table public.happyplace_profiles from anon;
grant select, insert, update, delete on table public.happyplace_profiles to authenticated;

drop policy if exists "read own profiles"   on public.happyplace_profiles;
drop policy if exists "insert own profiles" on public.happyplace_profiles;
drop policy if exists "update own profiles" on public.happyplace_profiles;
drop policy if exists "delete own profiles" on public.happyplace_profiles;

create policy "read own profiles" on public.happyplace_profiles
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "insert own profiles" on public.happyplace_profiles
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "update own profiles" on public.happyplace_profiles
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "delete own profiles" on public.happyplace_profiles
  for delete to authenticated using ((select auth.uid()) = user_id);

-- Keep a single row from growing without limit (≈ 2 MB per person).
alter table public.happyplace_profiles drop constraint if exists happyplace_data_size;
alter table public.happyplace_profiles add constraint happyplace_data_size
  check (pg_column_size(data) < 2000000);
