insert into public.service_categories (slug, name, icon_key, sort_order)
values
  ('menage', 'Menage', 'broom', 1),
  ('plomberie', 'Plomberie', 'pipe-wrench', 2),
  ('electricite', 'Electricite', 'lightning-bolt-outline', 3),
  ('jardinage', 'Jardinage', 'leaf-circle-outline', 4),
  ('demenagement', 'Demenagement', 'truck-delivery-outline', 5),
  ('peinture', 'Peinture', 'roller', 6);

insert into public.services (
  category_id,
  slug,
  name,
  short_description,
  base_price,
  rating,
  review_count,
  image_url,
  is_featured,
  featured_rank,
  is_active
)
values
  (
    (select id from public.service_categories where slug = 'menage'),
    'premium-apartment-refresh',
    'Premium Apartment Refresh',
    'Deep cleaning for apartments, kitchens, and shared spaces.',
    349.00,
    4.9,
    128,
    'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80',
    true,
    1,
    true
  ),
  (
    (select id from public.service_categories where slug = 'plomberie'),
    'express-pipe-repair',
    'Express Pipe Repair',
    'Fast response for leaks, clogs, and emergency plumbing fixes.',
    420.00,
    4.8,
    94,
    'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=80',
    true,
    2,
    true
  ),
  (
    (select id from public.service_categories where slug = 'electricite'),
    'home-electrical-check',
    'Home Electrical Check',
    'Install fixtures, replace outlets, and inspect home wiring safely.',
    380.00,
    4.7,
    86,
    'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80',
    true,
    3,
    true
  ),
  (
    (select id from public.service_categories where slug = 'jardinage'),
    'garden-revival-visit',
    'Garden Revival Visit',
    'Trim, clean, and refresh patios, courtyards, and small gardens.',
    295.00,
    4.8,
    63,
    'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1200&q=80',
    true,
    4,
    true
  ),
  (
    (select id from public.service_categories where slug = 'demenagement'),
    'city-move-assist',
    'City Move Assist',
    'Moving crew support for apartments, loading, and same-day relocations.',
    690.00,
    4.6,
    72,
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80',
    true,
    5,
    true
  ),
  (
    (select id from public.service_categories where slug = 'peinture'),
    'fresh-coat-studio-package',
    'Fresh Coat Studio Package',
    'Quick-turn interior painting for bedrooms, studios, and offices.',
    560.00,
    4.9,
    58,
    'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80',
    true,
    6,
    true
  ),
  (
    (select id from public.service_categories where slug = 'menage'),
    'weekly-home-reset',
    'Weekly Home Reset',
    'Recurring light cleaning designed for busy households.',
    199.00,
    4.5,
    211,
    'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    false,
    null,
    true
  ),
  (
    (select id from public.service_categories where slug = 'plomberie'),
    'water-heater-install',
    'Water Heater Install',
    'Professional installation and testing for new home water heaters.',
    950.00,
    4.7,
    41,
    'https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?auto=format&fit=crop&w=1200&q=80',
    false,
    null,
    true
  );
