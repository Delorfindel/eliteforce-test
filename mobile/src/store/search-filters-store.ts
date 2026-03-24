import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { uiStorage } from '@/lib/storage';

export type AvailabilityFilter = 'all' | 'within_7_days' | 'flexible';
export type SearchSort = 'recommended' | 'price_asc' | 'price_desc';

export type SearchFilters = {
  availability: AvailabilityFilter;
  categoryId: number | null;
  maxPrice: number | null;
  minRating: number;
  sortBy: SearchSort;
};

type SearchFiltersState = SearchFilters & {
  resetFilters: () => void;
  setAvailability: (value: AvailabilityFilter) => void;
  setCategoryId: (value: number | null) => void;
  setMaxPrice: (value: number | null) => void;
  setMinRating: (value: number) => void;
  setSortBy: (value: SearchSort) => void;
};

const defaultFilters: SearchFilters = {
  availability: 'all',
  categoryId: null,
  maxPrice: null,
  minRating: 0,
  sortBy: 'recommended',
};

export const useSearchFiltersStore = create<SearchFiltersState>()(
  persist(
    (set) => ({
      ...defaultFilters,
      resetFilters: () => set(defaultFilters),
      setAvailability: (value) => set({ availability: value }),
      setCategoryId: (value) => set({ categoryId: value }),
      setMaxPrice: (value) => set({ maxPrice: value }),
      setMinRating: (value) => set({ minRating: value }),
      setSortBy: (value) => set({ sortBy: value }),
    }),
    {
      name: 'eliteforce-search-filters',
      storage: createJSONStorage(() => uiStorage),
    },
  ),
);
