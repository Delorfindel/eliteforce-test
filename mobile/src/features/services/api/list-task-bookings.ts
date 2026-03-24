import {
  mapTaskBooking,
  type TaskBookingQueryRow,
  taskBookingSelect,
} from '@/features/services/api/tasker-shared';
import type { TaskBooking } from '@/features/services/types';
import { supabase } from '@/lib/supabase';

export async function listTaskBookings(clientId: string): Promise<TaskBooking[]> {
  const { data, error } = await supabase
    .from('task_bookings')
    .select(taskBookingSelect)
    .eq('client_id', clientId)
    .order('scheduled_for', { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => mapTaskBooking(item as TaskBookingQueryRow));
}
