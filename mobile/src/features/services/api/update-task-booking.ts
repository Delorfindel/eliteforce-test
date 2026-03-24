import {
  mapTaskBooking,
  type TaskBookingQueryRow,
  taskBookingSelect,
} from '@/features/services/api/tasker-shared';
import type { TaskBooking } from '@/features/services/types';
import { supabase } from '@/lib/supabase';

export async function cancelTaskBooking(bookingId: number): Promise<TaskBooking> {
  const { data, error } = await supabase
    .from('task_bookings')
    .update({ status: 'cancelled' })
    .eq('id', bookingId)
    .eq('status', 'confirmed')
    .gt('scheduled_for', new Date().toISOString())
    .select(taskBookingSelect)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('La réservation ne peut plus être annulée.');
  }

  return mapTaskBooking(data as TaskBookingQueryRow);
}

export async function rateTaskBooking(bookingId: number, rating: number): Promise<TaskBooking> {
  if (rating < 1 || rating > 5) {
    throw new Error('La note doit être comprise entre 1 et 5.');
  }

  const ratedAt = new Date().toISOString();
  const { data, error } = await supabase
    .from('task_bookings')
    .update({
      client_rated_at: ratedAt,
      client_rating: rating,
    })
    .eq('id', bookingId)
    .lt('scheduled_for', ratedAt)
    .neq('status', 'cancelled')
    .is('client_rating', null)
    .select(taskBookingSelect)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('La note ne peut pas être enregistrée pour cette réservation.');
  }

  return mapTaskBooking(data as TaskBookingQueryRow);
}
