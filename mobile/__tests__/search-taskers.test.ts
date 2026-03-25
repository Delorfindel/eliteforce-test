import { beforeEach, expect, jest, test } from '@jest/globals';

import { searchTaskers } from '@/features/services/api/search-taskers';
import type { TaskerOfferingRow } from '@/features/services/api/tasker-shared';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

type MockQueryResponse = {
  data: TaskerOfferingRow[] | null;
  error: Error | null;
};

type MockQueryBuilder = {
  eq: jest.Mock;
  lte: jest.Mock;
  or: jest.Mock;
  order: jest.Mock;
  select: jest.Mock;
};

const mockedSupabase = supabase as unknown as {
  from: jest.Mock;
};

function createQueryBuilder(response: MockQueryResponse): MockQueryBuilder {
  const builder = Promise.resolve(response) as unknown as MockQueryBuilder;

  builder.select = jest.fn(() => builder);
  builder.eq = jest.fn(() => builder);
  builder.order = jest.fn(() => builder);
  builder.lte = jest.fn(() => builder);
  builder.or = jest.fn(() => builder);

  return builder;
}

function createTaskerOfferingRow(params: {
  fullName: string;
  hourlyRate: number;
  id: number;
  rating: number;
}): TaskerOfferingRow {
  const [firstName, ...rest] = params.fullName.split(' ');
  const lastName = rest.join(' ') || 'Test';

  return {
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
    hourly_rate: params.hourlyRate,
    id: params.id,
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
      profile_id: `provider-${params.id}`,
      profiles: {
        accepted_terms_at: '2021-01-05T09:00:00Z',
        created_at: '2021-01-05T09:00:00Z',
        default_address: null,
        default_address_details: null,
        email: `provider-${params.id}@eliteforce.test`,
        first_name: firstName,
        id: `provider-${params.id}`,
        last_name: lastName,
        phone: '',
        role: 'provider',
        updated_at: '2026-03-24T09:00:00Z',
      },
      rating: params.rating,
      review_count: 1188,
      tools: ['Perceuse'],
      updated_at: '2026-03-24T09:00:00Z',
    },
    provider_id: `provider-${params.id}`,
    updated_at: '2026-03-24T09:00:00Z',
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

test('applies category, max price and within_7_days filters at query level', async () => {
  const builder = createQueryBuilder({
    data: [
      createTaskerOfferingRow({ fullName: 'Alice Martin', hourlyRate: 80, id: 1, rating: 4.8 }),
    ],
    error: null,
  });

  mockedSupabase.from.mockReturnValue(builder);

  await searchTaskers({
    availability: 'within_7_days',
    categoryId: 7,
    maxPrice: 120,
    minRating: 0,
    query: '',
    sortBy: 'recommended',
  });

  expect(mockedSupabase.from).toHaveBeenCalledWith('provider_category_offerings');
  expect(builder.eq).toHaveBeenCalledWith('is_active', true);
  expect(builder.eq).toHaveBeenCalledWith('category_id', 7);
  expect(builder.lte).toHaveBeenCalledWith('hourly_rate', 120);
  expect(builder.lte).toHaveBeenCalledWith('next_available_at', expect.any(String));
  expect(builder.or).not.toHaveBeenCalled();
});

test('filters by rating and search query before sorting', async () => {
  const builder = createQueryBuilder({
    data: [
      createTaskerOfferingRow({ fullName: 'Alice Martin', hourlyRate: 100, id: 1, rating: 4.9 }),
      createTaskerOfferingRow({ fullName: 'Alice Dubois', hourlyRate: 90, id: 2, rating: 3.8 }),
      createTaskerOfferingRow({ fullName: 'Bruno Leroy', hourlyRate: 120, id: 3, rating: 5 }),
    ],
    error: null,
  });

  mockedSupabase.from.mockReturnValue(builder);

  const result = await searchTaskers({
    availability: 'all',
    categoryId: null,
    maxPrice: null,
    minRating: 4,
    query: 'alice',
    sortBy: 'price_desc',
  });

  expect(builder.lte).not.toHaveBeenCalledWith('next_available_at', expect.any(String));
  expect(builder.or).not.toHaveBeenCalled();
  expect(result).toHaveLength(1);
  expect(result[0]?.provider.full_name).toBe('Alice Martin');
});
