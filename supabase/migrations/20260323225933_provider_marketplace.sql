create extension if not exists pgcrypto with schema extensions;

alter table public.profiles
drop constraint if exists profiles_role_check;

alter table public.profiles
add constraint profiles_role_check
check (role in ('client', 'provider', 'admin'));

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  metadata jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    phone,
    accepted_terms_at,
    role
  )
  values (
    new.id,
    new.email,
    trim(coalesce(metadata ->> 'first_name', '')),
    trim(coalesce(metadata ->> 'last_name', '')),
    coalesce(metadata ->> 'phone', ''),
    coalesce((metadata ->> 'accepted_terms_at')::timestamptz, timezone('utc', now())),
    'client'
  );

  return new;
end;
$$;

create or replace function public.prevent_profile_role_change()
returns trigger
language plpgsql
as $$
begin
  if old.role is distinct from new.role
    and current_user not in ('postgres', 'supabase_admin', 'service_role')
  then
    raise exception 'Profile role cannot be changed from the client.';
  end if;

  return new;
end;
$$;

drop trigger if exists profiles_prevent_role_change on public.profiles;

create trigger profiles_prevent_role_change
before update on public.profiles
for each row
execute function public.prevent_profile_role_change();

drop policy if exists "services_read_active" on public.services;
drop trigger if exists services_set_updated_at on public.services;
drop table if exists public.services cascade;

create table public.provider_profiles (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  avatar_url text,
  headline text not null,
  bio text not null,
  rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  completed_missions_count integer not null default 0 check (completed_missions_count >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.provider_services (
  id bigint generated always as identity primary key,
  provider_id uuid not null references public.provider_profiles(profile_id) on delete cascade,
  category_id bigint not null references public.service_categories(id),
  slug text not null unique,
  title text not null,
  short_description text not null,
  description text not null,
  hourly_rate numeric(10,2) not null check (hourly_rate >= 0),
  cover_image_url text,
  rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.service_reviews (
  id bigint generated always as identity primary key,
  service_id bigint not null references public.provider_services(id) on delete cascade,
  author_name text not null,
  rating numeric(2,1) not null check (rating >= 0 and rating <= 5),
  comment text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index provider_services_provider_id_idx
on public.provider_services (provider_id);

create index provider_services_category_hourly_rate_idx
on public.provider_services (category_id, hourly_rate);

create index provider_services_category_rating_idx
on public.provider_services (category_id, rating);

create index provider_services_search_trgm_idx
on public.provider_services
using gin (
  (
    coalesce(title, '') || ' ' ||
    coalesce(short_description, '') || ' ' ||
    coalesce(description, '')
  ) gin_trgm_ops
);

create index service_reviews_service_id_created_at_idx
on public.service_reviews (service_id, created_at desc);

create trigger provider_profiles_set_updated_at
before update on public.provider_profiles
for each row
execute function public.set_updated_at();

create trigger provider_services_set_updated_at
before update on public.provider_services
for each row
execute function public.set_updated_at();

alter table public.provider_profiles enable row level security;
alter table public.provider_services enable row level security;
alter table public.service_reviews enable row level security;

alter table public.provider_profiles force row level security;
alter table public.provider_services force row level security;
alter table public.service_reviews force row level security;

grant select on public.provider_profiles to anon, authenticated;
grant select on public.provider_services to anon, authenticated;
grant select on public.service_reviews to anon, authenticated;
grant insert, update on public.provider_services to authenticated;
grant usage, select on sequence public.provider_services_id_seq to authenticated;

create policy "provider_profiles_read_public_or_own"
on public.provider_profiles
for select
to anon, authenticated
using (
  is_active = true
  or (select auth.uid()) = profile_id
);

create policy "provider_profiles_insert_own"
on public.provider_profiles
for insert
to authenticated
with check (
  (select auth.uid()) = profile_id
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'provider'
  )
);

create policy "provider_profiles_update_own"
on public.provider_profiles
for update
to authenticated
using (
  (select auth.uid()) = profile_id
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'provider'
  )
)
with check (
  (select auth.uid()) = profile_id
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'provider'
  )
);

create policy "provider_services_read_active_or_own"
on public.provider_services
for select
to anon, authenticated
using (
  is_active = true
  or (select auth.uid()) = provider_id
);

create policy "provider_services_insert_own"
on public.provider_services
for insert
to authenticated
with check (
  (select auth.uid()) = provider_id
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'provider'
  )
);

create policy "provider_services_update_own"
on public.provider_services
for update
to authenticated
using (
  (select auth.uid()) = provider_id
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'provider'
  )
)
with check (
  (select auth.uid()) = provider_id
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'provider'
  )
);

create policy "service_reviews_read_all"
on public.service_reviews
for select
to anon, authenticated
using (true);
