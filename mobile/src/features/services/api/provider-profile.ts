import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type ProviderProfileRow = Database['public']['Tables']['provider_profiles']['Row'];

export async function getProviderProfile(profileId: string): Promise<ProviderProfileRow | null> {
  const { data, error } = await supabase
    .from('provider_profiles')
    .select('*')
    .eq('profile_id', profileId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as ProviderProfileRow | null;
}

export async function updateProviderProfileBio(
  profileId: string,
  bio: string,
): Promise<ProviderProfileRow> {
  const { data, error } = await supabase
    .from('provider_profiles')
    .update({ bio })
    .eq('profile_id', profileId)
    .select('*')
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error('La description prestataire n’a pas pu être enregistrée.');
  }

  return data as ProviderProfileRow;
}
