import {
  type MarketplaceServiceRow,
  mapMarketplaceServiceCard,
} from '@/features/services/api/shared';

test('mapMarketplaceServiceCard falls back when nested private profile is hidden by RLS', () => {
  const result = mapMarketplaceServiceCard({
    category: {
      created_at: '2026-03-24T00:00:00.000Z',
      icon_key: 'wrench',
      id: 1,
      name: 'Plomberie',
      slug: 'plomberie',
      sort_order: 1,
    },
    category_id: 1,
    cover_image_url: null,
    created_at: '2026-03-24T00:00:00.000Z',
    description: 'Reparation et installation',
    hourly_rate: 250,
    id: 42,
    is_active: true,
    provider: {
      avatar_url: null,
      bio: 'Prestataire experimente',
      completed_missions_count: 17,
      created_at: '2026-03-24T00:00:00.000Z',
      headline: 'Plombier certifie',
      is_active: true,
      profile_id: '11111111-1111-1111-1111-111111111111',
      profiles: null,
      rating: 4.9,
      review_count: 12,
      updated_at: '2026-03-24T00:00:00.000Z',
    },
    provider_id: '11111111-1111-1111-1111-111111111111',
    rating: 4.8,
    review_count: 7,
    short_description: 'Depannage rapide',
    slug: 'depannage-rapide',
    title: 'Depannage plomberie',
    updated_at: '2026-03-24T00:00:00.000Z',
  } as MarketplaceServiceRow);

  expect(result.provider.full_name).toBe('Prestataire EliteForce');
  expect(result.provider.headline).toBe('Plombier certifie');
  expect(result.title).toBe('Depannage plomberie');
});
