insert into public.service_categories (slug, name, icon_key, sort_order)
values
  ('menage', 'Ménage', 'broom', 1),
  ('plomberie', 'Plomberie', 'pipe-wrench', 2),
  ('electricite', 'Électricité', 'lightning-bolt-outline', 3),
  ('jardinage', 'Jardinage', 'leaf-circle-outline', 4),
  ('demenagement', 'Déménagement', 'truck-delivery-outline', 5),
  ('peinture', 'Peinture', 'format-paint', 6),
  ('montage-meuble', 'Montage de meubles', 'hammer-screwdriver', 7);

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at,
  is_anonymous
)
values (
  '00000000-0000-0000-0000-000000000000',
  '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
  'authenticated',
  'authenticated',
  'prestataire.demo@eliteforce.local',
  extensions.crypt('EliteForce123!', extensions.gen_salt('bf')),
  timezone('utc', now()),
  null,
  '',
  null,
  '',
  null,
  '',
  '',
  null,
  null,
  '{"provider":"email","providers":["email"]}'::jsonb,
  jsonb_build_object(
    'first_name', 'Yassine',
    'last_name', 'El Mansouri',
    'phone', '+212612345681',
    'accepted_terms_at', timezone('utc', now())
  ),
  false,
  timezone('utc', now()),
  timezone('utc', now()),
  null,
  null,
  '',
  '',
  null,
  '',
  0,
  null,
  '',
  null,
  false,
  null,
  false
);

insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at,
  id
)
values (
  '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
  '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
  jsonb_build_object(
    'sub', '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
    'email', 'prestataire.demo@eliteforce.local',
    'email_verified', true,
    'phone_verified', false
  ),
  'email',
  null,
  timezone('utc', now()),
  timezone('utc', now()),
  '4b21b4b1-0b57-4386-8a4d-41be40ef45d8'
);

update public.profiles
set
  role = 'provider',
  updated_at = timezone('utc', now())
where id = '6f2167ad-c38f-490f-8c59-fd4f4aa71c01';

insert into public.provider_profiles (
  profile_id,
  avatar_url,
  headline,
  bio,
  rating,
  review_count,
  completed_missions_count,
  is_active,
  tools,
  languages,
  is_elite,
  created_at,
  updated_at
)
values (
  '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
  'Plombier et monteur de meubles a domicile',
  'Interventions rapides a Casablanca pour les fuites, installations de robinetterie, montage de meubles en kit et petits travaux de finition. Plus de 80 missions realisees avec un suivi soigne du chantier et des explications claires avant chaque intervention.',
  4.9,
  12,
  86,
  true,
  array['Perceuse', 'Tournevis', 'Niveau'],
  array['Francais', 'Anglais'],
  true,
  '2022-06-14T09:30:00Z',
  timezone('utc', now())
);

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at,
  is_anonymous
)
values
  (
    '00000000-0000-0000-0000-000000000000',
    'c2788f77-a6b2-4ec8-88d7-d31f02c1e9a1',
    'authenticated',
    'authenticated',
    'alban.demo@eliteforce.local',
    extensions.crypt('EliteForce123!', extensions.gen_salt('bf')),
    timezone('utc', now()),
    null,
    '',
    null,
    '',
    null,
    '',
    '',
    null,
    null,
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'first_name', 'Alban',
      'last_name', 'Noel',
      'phone', '+212612345682',
      'accepted_terms_at', timezone('utc', now())
    ),
    false,
    timezone('utc', now()),
    timezone('utc', now()),
    null,
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null,
    false,
    null,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '0c69ed6a-a651-4970-a099-d3b9de5ba8d2',
    'authenticated',
    'authenticated',
    'juba.demo@eliteforce.local',
    extensions.crypt('EliteForce123!', extensions.gen_salt('bf')),
    timezone('utc', now()),
    null,
    '',
    null,
    '',
    null,
    '',
    '',
    null,
    null,
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'first_name', 'Juba',
      'last_name', 'Amar',
      'phone', '+212612345683',
      'accepted_terms_at', timezone('utc', now())
    ),
    false,
    timezone('utc', now()),
    timezone('utc', now()),
    null,
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null,
    false,
    null,
    false
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '9a300bb4-6ef7-41fd-b289-2f976e455d24',
    'authenticated',
    'authenticated',
    'hassen.demo@eliteforce.local',
    extensions.crypt('EliteForce123!', extensions.gen_salt('bf')),
    timezone('utc', now()),
    null,
    '',
    null,
    '',
    null,
    '',
    '',
    null,
    null,
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object(
      'first_name', 'Hassen',
      'last_name', 'Ait',
      'phone', '+212612345684',
      'accepted_terms_at', timezone('utc', now())
    ),
    false,
    timezone('utc', now()),
    timezone('utc', now()),
    null,
    null,
    '',
    '',
    null,
    '',
    0,
    null,
    '',
    null,
    false,
    null,
    false
  );

insert into auth.identities (
  provider_id,
  user_id,
  identity_data,
  provider,
  last_sign_in_at,
  created_at,
  updated_at,
  id
)
values
  (
    'c2788f77-a6b2-4ec8-88d7-d31f02c1e9a1',
    'c2788f77-a6b2-4ec8-88d7-d31f02c1e9a1',
    jsonb_build_object(
      'sub', 'c2788f77-a6b2-4ec8-88d7-d31f02c1e9a1',
      'email', 'alban.demo@eliteforce.local',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    null,
    timezone('utc', now()),
    timezone('utc', now()),
    'f3732e4a-2d49-44c8-8bc1-4b65d74be118'
  ),
  (
    '0c69ed6a-a651-4970-a099-d3b9de5ba8d2',
    '0c69ed6a-a651-4970-a099-d3b9de5ba8d2',
    jsonb_build_object(
      'sub', '0c69ed6a-a651-4970-a099-d3b9de5ba8d2',
      'email', 'juba.demo@eliteforce.local',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    null,
    timezone('utc', now()),
    timezone('utc', now()),
    'f2e852d5-0115-4896-83dc-32878d189864'
  ),
  (
    '9a300bb4-6ef7-41fd-b289-2f976e455d24',
    '9a300bb4-6ef7-41fd-b289-2f976e455d24',
    jsonb_build_object(
      'sub', '9a300bb4-6ef7-41fd-b289-2f976e455d24',
      'email', 'hassen.demo@eliteforce.local',
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    null,
    timezone('utc', now()),
    timezone('utc', now()),
    '82d4e5af-75fd-4c20-a078-3efc49c4b6fe'
  );

update public.profiles
set
  role = 'provider',
  updated_at = timezone('utc', now())
where id in (
  'c2788f77-a6b2-4ec8-88d7-d31f02c1e9a1',
  '0c69ed6a-a651-4970-a099-d3b9de5ba8d2',
  '9a300bb4-6ef7-41fd-b289-2f976e455d24'
);

insert into public.provider_profiles (
  profile_id,
  avatar_url,
  headline,
  bio,
  rating,
  review_count,
  completed_missions_count,
  is_active,
  tools,
  languages,
  is_elite,
  created_at,
  updated_at
)
values
  (
    'c2788f77-a6b2-4ec8-88d7-d31f02c1e9a1',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    'Monteur de meubles et fixations murales',
    'Ancien monteur chez Ikea, j interviens rapidement pour le montage de meubles, les fixations et les petits ajustements a domicile. Travail propre, ponctuel et soigne.',
    5.0,
    1188,
    1859,
    true,
    array['Perceuse', 'Visseuse', 'Niveau laser'],
    array['Francais', 'Anglais'],
    false,
    '2021-01-05T09:00:00Z',
    timezone('utc', now())
  ),
  (
    '0c69ed6a-a651-4970-a099-d3b9de5ba8d2',
    'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80',
    'Montage de meubles et bricolage',
    'Je monte vos meubles, perce proprement et gere les petits travaux du quotidien avec une communication claire avant et apres chaque intervention.',
    5.0,
    142,
    255,
    true,
    array['Perceuse', 'Chevilles', 'Boite a outils'],
    array['Francais', 'Arabe'],
    true,
    '2022-03-10T10:00:00Z',
    timezone('utc', now())
  ),
  (
    '9a300bb4-6ef7-41fd-b289-2f976e455d24',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    'Assemblage, accrochage et aide au demenagement',
    'Habitude des appartements parisiens, j aide sur les montages, fixations et manutentions avec une approche calme et organisee.',
    5.0,
    53,
    164,
    true,
    array['Sangles', 'Perceuse', 'Escabeau'],
    array['Francais'],
    false,
    '2023-02-18T08:45:00Z',
    timezone('utc', now())
  );


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
values
  (
    '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
    (select id from public.service_categories where slug = 'montage-meuble'),
    39.90,
    126,
    '2026-03-25T09:00:00Z',
    true,
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
    (select id from public.service_categories where slug = 'plomberie'),
    45.00,
    86,
    '2026-03-26T14:00:00Z',
    true,
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    'c2788f77-a6b2-4ec8-88d7-d31f02c1e9a1',
    (select id from public.service_categories where slug = 'montage-meuble'),
    41.85,
    1486,
    '2026-03-26T10:00:00Z',
    true,
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '0c69ed6a-a651-4970-a099-d3b9de5ba8d2',
    (select id from public.service_categories where slug = 'montage-meuble'),
    50.83,
    88,
    '2026-03-25T12:30:00Z',
    true,
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '9a300bb4-6ef7-41fd-b289-2f976e455d24',
    (select id from public.service_categories where slug = 'montage-meuble'),
    58.30,
    61,
    '2026-03-29T09:30:00Z',
    true,
    timezone('utc', now()),
    timezone('utc', now())
  ),
  (
    '9a300bb4-6ef7-41fd-b289-2f976e455d24',
    (select id from public.service_categories where slug = 'demenagement'),
    72.00,
    43,
    '2026-03-28T08:00:00Z',
    true,
    timezone('utc', now()),
    timezone('utc', now())
  );

insert into public.provider_reviews (
  provider_id,
  category_id,
  author_name,
  rating,
  comment,
  created_at
)
values
  (
    '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
    (select id from public.service_categories where slug = 'montage-meuble'),
    'Nadia F.',
    5.0,
    'Montage impeccable, ponctuel et tres soigne du debut a la fin.',
    '2025-03-01T11:15:00Z'
  ),
  (
    '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
    (select id from public.service_categories where slug = 'plomberie'),
    'Salma B.',
    5.0,
    'Tres bonne communication et intervention rapide a domicile.',
    '2025-03-09T09:20:00Z'
  ),
  (
    'c2788f77-a6b2-4ec8-88d7-d31f02c1e9a1',
    (select id from public.service_categories where slug = 'montage-meuble'),
    'Claire M.',
    5.0,
    'Alban a monte mon dressing parfaitement et a laisse la piece impeccable.',
    '2025-03-14T14:10:00Z'
  ),
  (
    'c2788f77-a6b2-4ec8-88d7-d31f02c1e9a1',
    (select id from public.service_categories where slug = 'montage-meuble'),
    'Romain L.',
    5.0,
    'Tres rassurant, rapide et efficace pour plusieurs meubles Ikea.',
    '2025-03-21T17:35:00Z'
  ),
  (
    '0c69ed6a-a651-4970-a099-d3b9de5ba8d2',
    (select id from public.service_categories where slug = 'montage-meuble'),
    'Leila A.',
    5.0,
    'Super experience, montage nickel et tres bonne energie.',
    '2025-03-08T10:45:00Z'
  ),
  (
    '0c69ed6a-a651-4970-a099-d3b9de5ba8d2',
    (select id from public.service_categories where slug = 'montage-meuble'),
    'Yanis D.',
    4.5,
    'Travail propre et soigne, je referai appel a lui.',
    '2025-03-18T16:20:00Z'
  ),
  (
    '9a300bb4-6ef7-41fd-b289-2f976e455d24',
    (select id from public.service_categories where slug = 'montage-meuble'),
    'Sarah T.',
    5.0,
    'Hassen est arrive a l heure et a tout fixe tres proprement.',
    '2025-03-12T13:00:00Z'
  ),
  (
    '9a300bb4-6ef7-41fd-b289-2f976e455d24',
    (select id from public.service_categories where slug = 'demenagement'),
    'Maya K.',
    5.0,
    'Tres bonne aide pour porter et installer des objets lourds.',
    '2025-03-22T09:50:00Z'
  );
