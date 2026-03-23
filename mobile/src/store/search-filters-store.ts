import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { uiStorage } from "@/lib/storage";

export type SearchFilters = {
  categoryId: number | null;
  maxPrice: number | null;
  minPrice: number;
  minRating: number;
};

type SearchFiltersState = SearchFilters & {
  resetFilters: () => void;
  setCategoryId: (value: number | null) => void;
  setMaxPrice: (value: number | null) => void;
  setMinPrice: (value: number) => void;
  setMinRating: (value: number) => void;
};

const defaultFilters: SearchFilters = {
  categoryId: null,
  minPrice: 0,
  maxPrice: null,
  minRating: 0
};

export const useSearchFiltersStore = create<SearchFiltersState>()(
  persist(
    (set) => ({
      ...defaultFilters,
      resetFilters: () => set(defaultFilters),
      setCategoryId: (value) => set({ categoryId: value }),
      setMaxPrice: (value) => set({ maxPrice: value }),
      setMinPrice: (value) => set({ minPrice: value }),
      setMinRating: (value) => set({ minRating: value })
    }),
    {
      name: "eliteforce-search-filters",
      storage: createJSONStorage(() => uiStorage)
    }
  )
);
