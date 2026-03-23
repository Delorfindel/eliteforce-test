begin;

do $$
declare
  owner_id uuid := '11111111-1111-1111-1111-111111111111';
  other_id uuid := '22222222-2222-2222-2222-222222222222';
  own_visible_count integer;
  other_visible_count integer;
  updated_rows integer;
  category_count integer;
  service_count integer;
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'on_auth_user_created'
  ) then
    raise exception 'Expected on_auth_user_created trigger to exist.';
  end if;

  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and indexname = 'services_category_price_idx'
  ) then
    raise exception 'Expected services_category_price_idx to exist.';
  end if;

  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    phone,
    accepted_terms_at,
    role
  )
  values
    (
      owner_id,
      'owner@example.com',
      'Owner',
      'User',
      '+212612345679',
      timezone('utc', now()),
      'client'
    ),
    (
      other_id,
      'other@example.com',
      'Other',
      'User',
      '+212612345680',
      timezone('utc', now()),
      'client'
    )
  on conflict (id) do nothing;

  perform set_config('request.jwt.claim.role', 'authenticated', true);
  perform set_config('request.jwt.claim.sub', owner_id::text, true);
  execute 'set local role authenticated';

  select count(*) into own_visible_count
  from public.profiles
  where id = owner_id;

  select count(*) into other_visible_count
  from public.profiles
  where id = other_id;

  update public.profiles
  set first_name = 'Blocked'
  where id = other_id;

  get diagnostics updated_rows = row_count;

  reset role;

  if own_visible_count <> 1 then
    raise exception 'Authenticated owner should be able to read their own profile.';
  end if;

  if other_visible_count <> 0 then
    raise exception 'Authenticated owner should not be able to read another profile.';
  end if;

  if updated_rows <> 0 then
    raise exception 'Authenticated owner should not be able to update another profile.';
  end if;

  perform set_config('request.jwt.claim.role', 'anon', true);
  perform set_config('request.jwt.claim.sub', '', true);
  execute 'set local role anon';

  select count(*) into category_count from public.service_categories;
  select count(*) into service_count from public.services where is_active = true;

  reset role;

  if category_count <> 6 then
    raise exception 'Expected 6 seeded categories but found %.', category_count;
  end if;

  if service_count < 6 then
    raise exception 'Expected at least 6 active seeded services but found %.', service_count;
  end if;
end
$$;

rollback;
