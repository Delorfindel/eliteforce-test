import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { uiStorage } from '@/lib/storage';

type ThemePreference = 'light' | 'system';

type UIState = {
  isAuthHydrated: boolean;
  searchPanelOpen: boolean;
  themePreference: ThemePreference;
  setAuthHydrated: (value: boolean) => void;
  setSearchPanelOpen: (value: boolean) => void;
  setThemePreference: (value: ThemePreference) => void;
};

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isAuthHydrated: false,
      searchPanelOpen: false,
      themePreference: 'light',
      setAuthHydrated: (value) => set({ isAuthHydrated: value }),
      setSearchPanelOpen: (value) => set({ searchPanelOpen: value }),
      setThemePreference: (value) => set({ themePreference: value }),
    }),
    {
      name: 'eliteforce-ui-store',
      storage: createJSONStorage(() => uiStorage),
      partialize: (state) => ({
        searchPanelOpen: state.searchPanelOpen,
        themePreference: state.themePreference,
      }),
    },
  ),
);
