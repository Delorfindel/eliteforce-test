insert into public.service_categories (slug, name, icon_key, sort_order)
values
  ('menage', 'Menage', 'broom', 1),
  ('plomberie', 'Plomberie', 'pipe-wrench', 2),
  ('electricite', 'Electricite', 'lightning-bolt-outline', 3),
  ('jardinage', 'Jardinage', 'leaf-circle-outline', 4),
  ('demenagement', 'Demenagement', 'truck-delivery-outline', 5),
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
  '2022-06-14T09:30:00Z',
  timezone('utc', now())
);

insert into public.provider_services (
  provider_id,
  category_id,
  slug,
  title,
  short_description,
  description,
  hourly_rate,
  cover_image_url,
  rating,
  review_count,
  is_active,
  created_at,
  updated_at
)
values
  (
    '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
    (select id from public.service_categories where slug = 'plomberie'),
    'reparation-fuite-cuisine-casablanca',
    'Reparation de fuite en cuisine',
    'Diagnostic rapide, remplacement de joints et remise en etat propre.',
    'Je prends en charge les fuites sous evier, les robinets qui gouttent et les petits depannages de cuisine. L intervention comprend le diagnostic, les ajustements necessaires et la verification finale pour laisser une installation propre et fonctionnelle.',
    220.00,
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=80',
    4.8,
    3,
    true,
    '2024-02-10T08:30:00Z',
    timezone('utc', now())
  ),
  (
    '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
    (select id from public.service_categories where slug = 'plomberie'),
    'installation-chauffe-eau',
    'Installation de chauffe-eau',
    'Pose, raccordement et tests de securite pour chauffe-eau domestique.',
    'Je gere l installation d un nouveau chauffe-eau avec verification des raccordements, tests de pression et conseils d entretien. La prestation est adaptee aux appartements et maisons avec acces standard.',
    260.00,
    'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?auto=format&fit=crop&w=1200&q=80',
    5.0,
    2,
    true,
    '2024-03-05T10:15:00Z',
    timezone('utc', now())
  ),
  (
    '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
    (select id from public.service_categories where slug = 'montage-meuble'),
    'montage-armoire-et-dressing',
    'Montage d armoire et dressing',
    'Assemblage complet, alignement des portes et finitions soignees.',
    'Je monte les armoires, dressings et grands meubles en kit en respectant le plan du fabricant. La prestation inclut le controle des niveaux, l ajustement des portes et une remise en place nette de la zone de travail.',
    210.00,
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    4.9,
    3,
    true,
    '2024-03-19T14:00:00Z',
    timezone('utc', now())
  ),
  (
    '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
    (select id from public.service_categories where slug = 'montage-meuble'),
    'montage-bureau-et-bibliotheque',
    'Montage de bureau et bibliotheque',
    'Montage propre pour espaces de travail, chambres et studios.',
    'Je monte les bureaux, etageres et bibliotheques avec ancrage simple si necessaire. Cette prestation est ideale pour les appartements et les espaces de teletravail qui demandent un montage rapide et stable.',
    180.00,
    'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
    4.7,
    2,
    true,
    '2024-04-02T11:45:00Z',
    timezone('utc', now())
  ),
  (
    '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
    (select id from public.service_categories where slug = 'electricite'),
    'pose-luminaire-et-petite-electricite',
    'Pose de luminaire et petite electricite',
    'Remplacement de luminaires, prises et interrupteurs en toute securite.',
    'J installe les suspensions, plafonniers et appliques, ainsi que les petits remplacements de prises et interrupteurs. Chaque intervention se termine par une verification du bon fonctionnement et de la fixation.',
    190.00,
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    4.8,
    2,
    true,
    '2024-04-16T09:00:00Z',
    timezone('utc', now())
  ),
  (
    '6f2167ad-c38f-490f-8c59-fd4f4aa71c01',
    (select id from public.service_categories where slug = 'peinture'),
    'retouches-peinture-interieur',
    'Retouches peinture interieur',
    'Prestation brouillon en preparation pour futurs chantiers.',
    'Cette prestation sert de brouillon pour de futures retouches peinture interieur. Elle reste masquee tant que les details definitifs et les photos chantier ne sont pas finalises.',
    170.00,
    'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80',
    0,
    0,
    false,
    '2024-05-01T08:00:00Z',
    timezone('utc', now())
  );

insert into public.service_reviews (
  service_id,
  author_name,
  rating,
  comment,
  created_at
)
values
  (
    (select id from public.provider_services where slug = 'reparation-fuite-cuisine-casablanca'),
    'Salma B.',
    5.0,
    'Intervention tres rapide et propre. La fuite sous l evier a ete reglee en moins d une heure.',
    '2025-01-12T10:30:00Z'
  ),
  (
    (select id from public.provider_services where slug = 'reparation-fuite-cuisine-casablanca'),
    'Imane R.',
    4.5,
    'Professionnel, ponctuel et clair sur le prix. Je referai appel a lui sans hesitation.',
    '2025-02-03T15:00:00Z'
  ),
  (
    (select id from public.provider_services where slug = 'reparation-fuite-cuisine-casablanca'),
    'Mehdi T.',
    5.0,
    'Tres bon depannage et bonne explication sur ce qui a cause la fuite.',
    '2025-02-26T18:45:00Z'
  ),
  (
    (select id from public.provider_services where slug = 'installation-chauffe-eau'),
    'Amina K.',
    5.0,
    'Installation impeccable et verifications faites avant de partir.',
    '2025-01-22T13:20:00Z'
  ),
  (
    (select id from public.provider_services where slug = 'installation-chauffe-eau'),
    'Youssef H.',
    5.0,
    'Tres serieux, a bien explique le fonctionnement et l entretien.',
    '2025-03-04T09:10:00Z'
  ),
  (
    (select id from public.provider_services where slug = 'montage-armoire-et-dressing'),
    'Nadia F.',
    5.0,
    'Mon dressing a ete monte parfaitement, avec des finitions tres propres.',
    '2025-02-08T12:00:00Z'
  ),
  (
    (select id from public.provider_services where slug = 'montage-armoire-et-dressing'),
    'Hamza L.',
    4.5,
    'Travail soigne et meuble bien aligne. Rien a redire.',
    '2025-02-17T17:30:00Z'
  ),
  (
    (select id from public.provider_services where slug = 'montage-armoire-et-dressing'),
    'Sara M.',
    5.0,
    'Efficace, poli et tres organise pendant tout le montage.',
    '2025-03-01T11:15:00Z'
  ),
  (
    (select id from public.provider_services where slug = 'montage-bureau-et-bibliotheque'),
    'Omar D.',
    4.5,
    'Le bureau et la bibliotheque ont ete montes vite et sans laisser de desordre.',
    '2025-02-11T16:10:00Z'
  ),
  (
    (select id from public.provider_services where slug = 'montage-bureau-et-bibliotheque'),
    'Leila A.',
    5.0,
    'Tres pratique pour mon coin teletravail, montage nickel.',
    '2025-03-06T08:50:00Z'
  ),
  (
    (select id from public.provider_services where slug = 'pose-luminaire-et-petite-electricite'),
    'Karim S.',
    5.0,
    'Suspension bien posee, propre et rapide.',
    '2025-02-14T14:40:00Z'
  ),
  (
    (select id from public.provider_services where slug = 'pose-luminaire-et-petite-electricite'),
    'Meriem C.',
    4.5,
    'Ponctuel et rassurant. La nouvelle applique est tres bien installee.',
    '2025-03-09T19:05:00Z'
  );
