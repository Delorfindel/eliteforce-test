import { expect, test } from '@jest/globals';

import {
  createProviderCategoryOfferingInsert,
  createProviderCategoryOfferingUpdate,
} from '@/features/services/api/tasker-shared';

test('createProviderCategoryOfferingInsert builds a provider-owned payload', () => {
  expect(
    createProviderCategoryOfferingInsert(
      {
        categoryId: 12,
        hourlyRate: 41.85,
        isActive: true,
        nextAvailableAt: '2026-03-26T10:00:00Z',
      },
      'provider-id',
    ),
  ).toEqual({
    category_id: 12,
    hourly_rate: 41.85,
    is_active: true,
    next_available_at: '2026-03-26T10:00:00Z',
    provider_id: 'provider-id',
  });
});

test('createProviderCategoryOfferingUpdate keeps mutable offering fields only', () => {
  expect(
    createProviderCategoryOfferingUpdate({
      categoryId: 8,
      hourlyRate: 50.83,
      isActive: false,
      nextAvailableAt: null,
    }),
  ).toEqual({
    category_id: 8,
    hourly_rate: 50.83,
    is_active: false,
    next_available_at: null,
  });
});
