import {
  mapTaskerSearchResult,
  type TaskerOfferingRow,
  taskerOfferingSelect,
} from '@/features/services/api/tasker-shared';
import type { TaskerSearchResult } from '@/features/services/types';
import { supabase } from '@/lib/supabase';
import type { SearchFilters } from '@/store/search-filters-store';

export type SearchTaskersInput = SearchFilters & {
  query: string;
};

function sortResults(items: TaskerSearchResult[], sortBy: SearchFilters['sortBy']) {
  const next = [...items];

  if (sortBy === 'price_asc') {
    return next.sort((left, right) => left.hourly_rate - right.hourly_rate);
  }

  if (sortBy === 'price_desc') {
    return next.sort((left, right) => right.hourly_rate - left.hourly_rate);
  }

  return next.sort((left, right) => {
    if (right.provider.rating !== left.provider.rating) {
      return right.provider.rating - left.provider.rating;
    }

    if (right.provider.review_count !== left.provider.review_count) {
      return right.provider.review_count - left.provider.review_count;
    }

    return left.hourly_rate - right.hourly_rate;
  });
}

export async function searchTaskers(filters: SearchTaskersInput): Promise<TaskerSearchResult[]> {
  let query = supabase
    .from('provider_category_offerings')
    .select(taskerOfferingSelect)
    .eq('is_active', true)
    .order('hourly_rate', { ascending: true });

  if (filters.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters.maxPrice !== null) {
    query = query.lte('hourly_rate', filters.maxPrice);
  }

  if (filters.availability === 'within_7_days') {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    query = query.lte('next_available_at', nextWeek.toISOString());
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  const normalizedQuery = filters.query.trim().toLowerCase();

  const mapped = (data ?? []).map((item) => mapTaskerSearchResult(item as TaskerOfferingRow));

  const filtered = mapped.filter((item) => {
    if (item.provider.rating < filters.minRating) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const haystack = [
      item.category.name,
      item.provider.full_name,
      item.provider.headline,
      item.provider.bio,
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(normalizedQuery);
  });

  return sortResults(filtered, filters.sortBy);
}
