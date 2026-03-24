begin;

do $$
declare
  provider_owner_id uuid := '11111111-1111-1111-1111-111111111111';
  other_provider_id uuid := '22222222-2222-2222-2222-222222222222';
  client_id uuid := '33333333-3333-3333-3333-333333333333';
  plomberie_category_id bigint;
  electricite_category_id bigint;
  demenagement_category_id bigint;
  own_visible_count integer;
  other_visible_count integer;
  other_profile_updates integer;
  own_offering_updates integer;
  other_offering_updates integer;
  own_inactive_visible_count integer;
  other_inactive_visible_count integer;
  inserted_offering_id bigint;
  category_count integer;
  public_provider_count integer;
  public_offering_count integer;
  public_review_count integer;
  role_change_blocked boolean := false;
  client_insert_blocked boolean := false;
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
    from pg_trigger
    where tgname = 'profiles_prevent_role_change'
  ) then
    raise exception 'Expected profiles_prevent_role_change trigger to exist.';
  end if;

  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and indexname = 'provider_category_offerings_search_idx'
  ) then
    raise exception 'Expected provider_category_offerings_search_idx to exist.';
  end if;

  select id
  into plomberie_category_id
  from public.service_categories
  where slug = 'plomberie';

  select id
  into electricite_category_id
  from public.service_categories
  where slug = 'electricite';

  select id
  into demenagement_category_id
  from public.service_categories
  where slug = 'demenagement';

  insert into auth.users (
    id,
    aud,
    role,
    email,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  )
  values
    (
      provider_owner_id,
      'authenticated',
      'authenticated',
      'provider-owner@example.com',
      timezone('utc', now()),
      timezone('utc', now()),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object(
        'first_name', 'Provider',
        'last_name', 'Owner',
        'phone', '+212612345682',
        'accepted_terms_at', timezone('utc', now())
      )
    ),
    (
      other_provider_id,
      'authenticated',
      'authenticated',
      'provider-other@example.com',
      timezone('utc', now()),
      timezone('utc', now()),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object(
        'first_name', 'Provider',
        'last_name', 'Other',
        'phone', '+212612345683',
        'accepted_terms_at', timezone('utc', now())
      )
    ),
    (
      client_id,
      'authenticated',
      'authenticated',
      'client@example.com',
      timezone('utc', now()),
      timezone('utc', now()),
      timezone('utc', now()),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object(
        'first_name', 'Client',
        'last_name', 'User',
        'phone', '+212612345684',
        'accepted_terms_at', timezone('utc', now())
      )
    )
  on conflict (id) do update
  set
    email = excluded.email,
    updated_at = excluded.updated_at,
    raw_user_meta_data = excluded.raw_user_meta_data;

  update public.profiles
  set role = 'provider'
  where id in (provider_owner_id, other_provider_id);

  insert into public.provider_profiles (
    profile_id,
    headline,
    bio,
    rating,
    review_count,
    completed_missions_count,
    is_active
  )
  values
    (
      provider_owner_id,
      'Provider owner',
      'Owner bio',
      4.8,
      8,
      20,
      true
    ),
    (
      other_provider_id,
      'Provider other',
      'Other bio',
      4.7,
      5,
      11,
      true
    )
  on conflict (profile_id) do nothing;

  insert into public.provider_category_offerings (
    provider_id,
    category_id,
    hourly_rate,
    completed_task_count,
    next_available_at,
    is_active
  )
  values
    (
      provider_owner_id,
      plomberie_category_id,
      150,
      2,
      timezone('utc', now()) + interval '2 days',
      true
    ),
    (
      provider_owner_id,
      electricite_category_id,
      140,
      0,
      timezone('utc', now()) + interval '10 days',
      false
    ),
    (
      other_provider_id,
      plomberie_category_id,
      130,
      0,
      timezone('utc', now()) + interval '12 days',
      false
    )
  on conflict (provider_id, category_id) do nothing;

  insert into public.provider_reviews (
    provider_id,
    category_id,
    author_name,
    rating,
    comment
  )
  values (
    provider_owner_id,
    plomberie_category_id,
    'Fixture reviewer',
    5,
    'Excellent fixture review.'
  );

  perform set_config('request.jwt.claim.role', 'authenticated', true);
  perform set_config('request.jwt.claim.sub', provider_owner_id::text, true);
  execute 'set local role authenticated';

  select count(*) into own_visible_count
  from public.profiles
  where id = provider_owner_id;

  select count(*) into other_visible_count
  from public.profiles
  where id = other_provider_id;

  update public.profiles
  set first_name = 'Blocked'
  where id = other_provider_id;

  get diagnostics other_profile_updates = row_count;

  begin
    update public.profiles
    set role = 'admin'
    where id = provider_owner_id;
  exception
    when others then
      role_change_blocked := true;
  end;

  update public.provider_category_offerings
  set hourly_rate = 155
  where provider_id = provider_owner_id
    and category_id = plomberie_category_id;

  get diagnostics own_offering_updates = row_count;

  update public.provider_category_offerings
  set hourly_rate = 135
  where provider_id = other_provider_id
    and category_id = plomberie_category_id;

  get diagnostics other_offering_updates = row_count;

  select count(*) into own_inactive_visible_count
  from public.provider_category_offerings
  where provider_id = provider_owner_id
    and category_id = electricite_category_id;

  select count(*) into other_inactive_visible_count
  from public.provider_category_offerings
  where provider_id = other_provider_id
    and category_id = plomberie_category_id;

  insert into public.provider_category_offerings (
    provider_id,
    category_id,
    hourly_rate,
    completed_task_count,
    next_available_at,
    is_active
  )
  values (
    provider_owner_id,
    demenagement_category_id,
    175,
    0,
    timezone('utc', now()) + interval '1 day',
    true
  )
  returning id into inserted_offering_id;

  reset role;

  perform set_config('request.jwt.claim.role', 'authenticated', true);
  perform set_config('request.jwt.claim.sub', client_id::text, true);
  execute 'set local role authenticated';

  begin
    insert into public.provider_category_offerings (
      provider_id,
      category_id,
      hourly_rate,
      completed_task_count,
      next_available_at,
      is_active
    )
    values (
      client_id,
      plomberie_category_id,
      120,
      0,
      timezone('utc', now()) + interval '3 days',
      true
    );
  exception
    when others then
      client_insert_blocked := true;
  end;

  reset role;

  perform set_config('request.jwt.claim.role', 'anon', true);
  perform set_config('request.jwt.claim.sub', '', true);
  execute 'set local role anon';

  select count(*) into category_count from public.service_categories;
  select count(*) into public_provider_count from public.provider_profiles;
  select count(*) into public_offering_count from public.provider_category_offerings;
  select count(*) into public_review_count from public.provider_reviews;

  reset role;

  if own_visible_count <> 1 then
    raise exception 'Authenticated owner should be able to read their own profile.';
  end if;

  if other_visible_count <> 0 then
    raise exception 'Authenticated owner should not be able to read another profile.';
  end if;

  if other_profile_updates <> 0 then
    raise exception 'Authenticated owner should not be able to update another profile.';
  end if;

  if not role_change_blocked then
    raise exception 'Authenticated users must not be able to change their own role.';
  end if;

  if own_offering_updates <> 1 then
    raise exception 'Provider owner should be able to update their own offering.';
  end if;

  if other_offering_updates <> 0 then
    raise exception 'Provider owner should not be able to update another provider offering.';
  end if;

  if own_inactive_visible_count <> 1 then
    raise exception 'Provider owner should be able to read their own inactive offering.';
  end if;

  if other_inactive_visible_count <> 0 then
    raise exception 'Provider owner should not be able to read another provider inactive offering.';
  end if;

  if inserted_offering_id is null then
    raise exception 'Provider owner should be able to insert their own offering.';
  end if;

  if not client_insert_blocked then
    raise exception 'Clients should not be able to insert provider offerings.';
  end if;

  if category_count <> 7 then
    raise exception 'Expected 7 seeded categories but found %.', category_count;
  end if;

  if public_provider_count < 1 then
    raise exception 'Expected at least one public provider profile.';
  end if;

  if public_offering_count < 5 then
    raise exception 'Expected at least 5 public active provider offerings but found %.', public_offering_count;
  end if;

  if public_review_count < 12 then
    raise exception 'Expected at least 12 public seeded reviews but found %.', public_review_count;
  end if;
end
$$;

rollback;
