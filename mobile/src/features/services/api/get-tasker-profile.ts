import {
  mapTaskerProfile,
  type TaskerOfferingRow,
  taskerOfferingSelect,
} from '@/features/services/api/tasker-shared';
import type { TaskerProfile } from '@/features/services/types';
import { supabase } from '@/lib/supabase';

export async function getTaskerProfile(offeringId: number): Promise<TaskerProfile> {
  const { data, error } = await supabase
    .from('provider_category_offerings')
    .select(taskerOfferingSelect)
    .eq('id', offeringId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('Ce profil n’est plus disponible.');
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from('provider_reviews')
    .select('*')
    .eq('provider_id', data.provider_id)
    .order('created_at', { ascending: false })
    .limit(12);

  if (reviewsError) {
    throw reviewsError;
  }

  return mapTaskerProfile(data as TaskerOfferingRow, reviews ?? []);
}
