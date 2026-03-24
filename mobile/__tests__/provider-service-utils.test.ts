import { afterEach, expect, jest, test } from '@jest/globals';

import {
  createProviderServiceInsert,
  createProviderServiceUpdate,
  slugifyTitle,
} from '@/features/services/api/shared';

afterEach(() => {
  jest.restoreAllMocks();
});

test('slugifyTitle strips accents and punctuation', () => {
  expect(slugifyTitle("Montage d'armoire & dressing !")).toBe('montage-d-armoire-dressing');
});

test('createProviderServiceInsert builds a provider-owned payload', () => {
  jest.spyOn(Date, 'now').mockReturnValue(1_700_000_000_000);

  expect(
    createProviderServiceInsert(
      {
        categoryId: 7,
        coverImageUrl: 'https://images.test/service.jpg',
        description: "Montage complet d'un dressing avec finitions propres.",
        hourlyRate: 220,
        isActive: true,
        shortDescription: 'Montage rapide et soigne.',
        title: 'Montage dressing',
      },
      'provider-1',
    ),
  ).toEqual({
    category_id: 7,
    cover_image_url: 'https://images.test/service.jpg',
    description: "Montage complet d'un dressing avec finitions propres.",
    hourly_rate: 220,
    is_active: true,
    provider_id: 'provider-1',
    short_description: 'Montage rapide et soigne.',
    slug: 'montage-dressing-loyw3v28',
    title: 'Montage dressing',
  });
});

test('createProviderServiceUpdate keeps mutable service fields only', () => {
  expect(
    createProviderServiceUpdate({
      categoryId: 2,
      coverImageUrl: '',
      description: 'Nouvelle description detaillee',
      hourlyRate: 180,
      isActive: false,
      shortDescription: 'Resume court',
      title: 'Nouveau titre',
    }),
  ).toEqual({
    category_id: 2,
    cover_image_url: null,
    description: 'Nouvelle description detaillee',
    hourly_rate: 180,
    is_active: false,
    short_description: 'Resume court',
    title: 'Nouveau titre',
  });
});
