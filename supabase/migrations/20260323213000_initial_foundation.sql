create extension if not exists pg_trgm with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text not null,
  last_name text not null,
  phone text not null unique,
  accepted_terms_at timestamptz not null,
  role text not null default 'client' check (role in ('client', 'admin')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint profiles_phone_format check (phone ~ '^\+212\d{9}$')
);

create table public.service_categories (
  id bigint generated always as identity primary key,
  slug text not null unique,
  name text not null unique,
  icon_key text not null,
  sort_order integer not null unique,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.services (
  id bigint generated always as identity primary key,
  category_id bigint not null references public.service_categories(id),
  slug text not null unique,
  name text not null,
  short_description text not null,
  base_price numeric(10,2) not null check (base_price >= 0),
  rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  review_count integer not null default 0 check (review_count >= 0),
  image_url text,
  is_featured boolean not null default false,
  featured_rank integer,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint services_featured_rank_consistency check (
    (is_featured = true and featured_rank is not null)
    or (is_featured = false and featured_rank is null)
  )
);

create index services_category_id_idx on public.services (category_id);
create index services_category_price_idx on public.services (category_id, base_price);
create index services_category_rating_idx on public.services (category_id, rating);
create index services_featured_rank_idx on public.services (is_featured, featured_rank);
create index services_search_trgm_idx
  on public.services
  using gin ((coalesce(name, '') || ' ' || coalesce(short_description, '')) gin_trgm_ops);

create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

create trigger services_set_updated_at
before update on public.services
for each row
execute function public.set_updated_at();

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
    coalesce(metadata ->> 'role', 'client')
  );

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.service_categories enable row level security;
alter table public.services enable row level security;

alter table public.profiles force row level security;
alter table public.service_categories force row level security;
alter table public.services force row level security;

grant select, update on public.profiles to authenticated;
grant select on public.service_categories to anon, authenticated;
grant select on public.services to anon, authenticated;

create policy "profiles_select_own"
on public.profiles
for select
to authenticated
using ((select auth.uid()) = id);

create policy "profiles_update_own"
on public.profiles
for update
to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "service_categories_read_all"
on public.service_categories
for select
to anon, authenticated
using (true);

create policy "services_read_active"
on public.services
for select
to anon, authenticated
using (is_active = true);
