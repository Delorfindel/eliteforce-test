import {
  mapTaskBooking,
  type TaskBookingQueryRow,
  taskBookingSelect,
} from '@/features/services/api/tasker-shared';
import type { TaskBooking } from '@/features/services/types';
import { supabase } from '@/lib/supabase';

export async function listTaskBookings(
  profileId: string,
  options?: { asProvider?: boolean },
): Promise<TaskBooking[]> {
  const query = supabase
    .from('task_bookings')
    .select(taskBookingSelect)
    .order('scheduled_for', { ascending: true });

  const { data, error } = options?.asProvider
    ? await query.eq('provider_id', profileId)
    : await query.eq('client_id', profileId);

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => mapTaskBooking(item as TaskBookingQueryRow));
}
