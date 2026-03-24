import { create } from 'zustand';

type BookingFlowState = {
  categoryId: number | null;
  notes: string;
  offeringId: number | null;
  providerId: string | null;
  reset: () => void;
  scheduledFor: string | null;
  setNotes: (value: string) => void;
  setSchedule: (value: string | null) => void;
  setSelection: (input: { categoryId: number; offeringId: number; providerId: string }) => void;
};

const defaultState = {
  categoryId: null,
  notes: '',
  offeringId: null,
  providerId: null,
  scheduledFor: null,
};

export const useBookingFlowStore = create<BookingFlowState>()((set) => ({
  ...defaultState,
  reset: () => set(defaultState),
  setNotes: (value) => set({ notes: value }),
  setSchedule: (value) => set({ scheduledFor: value }),
  setSelection: ({ categoryId, offeringId, providerId }) =>
    set({
      categoryId,
      offeringId,
      providerId,
    }),
}));
