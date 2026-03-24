import {
  mapTaskBooking,
  type TaskBookingQueryRow,
  taskBookingSelect,
} from '@/features/services/api/tasker-shared';
import type { TaskBooking } from '@/features/services/types';
import { supabase } from '@/lib/supabase';

export async function getTaskBooking(bookingId: number): Promise<TaskBooking | null> {
  const { data, error } = await supabase
    .from('task_bookings')
    .select(taskBookingSelect)
    .eq('id', bookingId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  return mapTaskBooking(data as TaskBookingQueryRow);
}
