import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { SavedAddress } from '@/features/services/types';
import { uiStorage } from '@/lib/storage';

type AddressHistoryState = {
  addRecentAddress: (value: SavedAddress) => void;
  recentAddresses: SavedAddress[];
};

export const useAddressHistoryStore = create<AddressHistoryState>()(
  persist(
    (set, get) => ({
      addRecentAddress: (value) => {
        const next = [
          value,
          ...get().recentAddresses.filter(
            (item) => item.label !== value.label || item.details !== value.details,
          ),
        ].slice(0, 5);

        set({ recentAddresses: next });
      },
      recentAddresses: [],
    }),
    {
      name: 'eliteforce-address-history',
      storage: createJSONStorage(() => uiStorage),
    },
  ),
);
