alter table public.profiles
add column if not exists default_address text,
add column if not exists default_address_details text;

alter table public.provider_profiles
add column if not exists tools text[] not null default '{}'::text[],
add column if not exists languages text[] not null default '{"Francais"}'::text[],
add column if not exists is_elite boolean not null default false;

create table public.provider_category_offerings (
  id bigint generated always as identity primary key,
  provider_id uuid not null references public.provider_profiles(profile_id) on delete cascade,
  category_id bigint not null references public.service_categories(id) on delete cascade,
  hourly_rate numeric(10,2) not null check (hourly_rate >= 0),
  completed_task_count integer not null default 0 check (completed_task_count >= 0),
  next_available_at timestamptz,
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint provider_category_offerings_provider_category_key unique (provider_id, category_id)
);

create table public.provider_reviews (
  id bigint generated always as identity primary key,
  provider_id uuid not null references public.provider_profiles(profile_id) on delete cascade,
  category_id bigint references public.service_categories(id) on delete set null,
  author_name text not null,
  rating numeric(2,1) not null check (rating >= 0 and rating <= 5),
  comment text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.task_bookings (
  id bigint generated always as identity primary key,
  client_id uuid not null references public.profiles(id) on delete cascade,
  provider_id uuid not null references public.provider_profiles(profile_id) on delete restrict,
  category_id bigint not null references public.service_categories(id) on delete restrict,
  offering_id bigint references public.provider_category_offerings(id) on delete set null,
  scheduled_for timestamptz not null,
  hourly_rate numeric(10,2) not null check (hourly_rate >= 0),
  total_price numeric(10,2) not null check (total_price >= 0),
  currency_code text not null default 'EUR',
  address text not null,
  address_details text,
  notes text,
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled', 'completed')),
  payment_status text not null default 'pending' check (
    payment_status in ('pending', 'authorized', 'paid', 'failed')
  ),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index provider_category_offerings_provider_id_idx
on public.provider_category_offerings (provider_id);

create index provider_category_offerings_search_idx
on public.provider_category_offerings (category_id, is_active, hourly_rate);

create index provider_category_offerings_next_available_idx
on public.provider_category_offerings (next_available_at);

create index provider_reviews_provider_id_created_at_idx
on public.provider_reviews (provider_id, created_at desc);

create index task_bookings_client_id_scheduled_for_idx
on public.task_bookings (client_id, scheduled_for desc);

create index task_bookings_provider_id_scheduled_for_idx
on public.task_bookings (provider_id, scheduled_for desc);

create trigger provider_category_offerings_set_updated_at
before update on public.provider_category_offerings
for each row
execute function public.set_updated_at();

create trigger task_bookings_set_updated_at
before update on public.task_bookings
for each row
execute function public.set_updated_at();

insert into public.provider_category_offerings (
  provider_id,
  category_id,
  hourly_rate,
  completed_task_count,
  next_available_at,
  is_active,
  created_at,
  updated_at
)
select distinct on (service.provider_id, service.category_id)
  service.provider_id,
  service.category_id,
  service.hourly_rate,
  0,
  timezone('utc', now()) + interval '2 days',
  service.is_active,
  service.created_at,
  service.updated_at
from public.provider_services as service
order by
  service.provider_id,
  service.category_id,
  service.is_active desc,
  service.review_count desc,
  service.updated_at desc;

insert into public.provider_reviews (
  provider_id,
  category_id,
  author_name,
  rating,
  comment,
  created_at
)
select
  service.provider_id,
  service.category_id,
  review.author_name,
  review.rating,
  review.comment,
  review.created_at
from public.service_reviews as review
join public.provider_services as service
  on service.id = review.service_id;

alter table public.provider_category_offerings enable row level security;
alter table public.provider_reviews enable row level security;
alter table public.task_bookings enable row level security;

alter table public.provider_category_offerings force row level security;
alter table public.provider_reviews force row level security;
alter table public.task_bookings force row level security;

grant select on public.provider_category_offerings to anon, authenticated;
grant insert, update on public.provider_category_offerings to authenticated;
grant usage, select on sequence public.provider_category_offerings_id_seq to authenticated;

grant select on public.provider_reviews to anon, authenticated;

grant select, insert on public.task_bookings to authenticated;
grant usage, select on sequence public.task_bookings_id_seq to authenticated;

create policy "provider_category_offerings_read_active_or_own"
on public.provider_category_offerings
for select
to anon, authenticated
using (
  is_active = true
  or (select auth.uid()) = provider_id
);

create policy "provider_category_offerings_insert_own"
on public.provider_category_offerings
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

create policy "provider_category_offerings_update_own"
on public.provider_category_offerings
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

create policy "provider_reviews_read_all"
on public.provider_reviews
for select
to anon, authenticated
using (true);

create policy "task_bookings_read_participants"
on public.task_bookings
for select
to authenticated
using (
  (select auth.uid()) = client_id
  or (select auth.uid()) = provider_id
);

create policy "task_bookings_insert_client"
on public.task_bookings
for insert
to authenticated
with check (
  (select auth.uid()) = client_id
  and exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'client'
  )
);
