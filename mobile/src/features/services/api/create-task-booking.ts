import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type TaskBookingInsert = Database['public']['Tables']['task_bookings']['Insert'];

export type CreateTaskBookingInput = {
  address: string;
  addressDetails: string;
  categoryId: number;
  clientId: string;
  hourlyRate: number;
  notes: string;
  offeringId: number;
  providerId: string;
  scheduledFor: string;
};

export async function createTaskBooking(input: CreateTaskBookingInput) {
  const payload: TaskBookingInsert = {
    address: input.address.trim(),
    address_details: input.addressDetails.trim() || null,
    category_id: input.categoryId,
    client_id: input.clientId,
    hourly_rate: input.hourlyRate,
    notes: input.notes.trim() || null,
    offering_id: input.offeringId,
    payment_status: 'pending',
    provider_id: input.providerId,
    scheduled_for: input.scheduledFor,
    status: 'confirmed',
    total_price: input.hourlyRate,
  };

  const { data, error } = await supabase
    .from('task_bookings')
    .insert(payload)
    .select('id')
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('La reservation n a pas pu etre creee.');
  }

  return data;
}
