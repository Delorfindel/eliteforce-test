import { expect, test } from '@jest/globals';

import {
  mapTaskerSearchResult,
  type TaskerOfferingRow,
} from '@/features/services/api/tasker-shared';

test('mapTaskerSearchResult falls back when nested private profile is hidden by RLS', () => {
  const result = mapTaskerSearchResult({
    category: {
      created_at: '2026-03-24T09:00:00Z',
      icon_key: 'hammer',
      id: 1,
      name: 'Montage de meubles',
      slug: 'montage-meuble',
      sort_order: 1,
    },
    category_id: 1,
    completed_task_count: 1486,
    created_at: '2026-03-24T09:00:00Z',
    hourly_rate: 41.85,
    id: 22,
    is_active: true,
    next_available_at: '2026-03-26T10:00:00Z',
    provider: {
      avatar_url: null,
      bio: 'Ancien monteur chez Ikea.',
      completed_missions_count: 1859,
      created_at: '2021-01-05T09:00:00Z',
      headline: 'Montage de meubles et fixations',
      is_active: true,
      is_elite: true,
      languages: ['Francais', 'Anglais'],
      profile_id: 'provider-id',
      profiles: null,
      rating: 5,
      review_count: 1188,
      tools: ['Perceuse'],
      updated_at: '2026-03-24T09:00:00Z',
    },
    provider_id: 'provider-id',
    updated_at: '2026-03-24T09:00:00Z',
  } as TaskerOfferingRow);

  expect(result).toMatchObject({
    completed_task_count: 1486,
    hourly_rate: 41.85,
    id: 22,
    provider: {
      full_name: 'Prestataire EliteForce',
      is_elite: true,
      languages: ['Francais', 'Anglais'],
      tools: ['Perceuse'],
    },
  });
});
