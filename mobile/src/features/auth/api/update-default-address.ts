import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

type UpdateDefaultAddressInput = {
  defaultAddress: string;
  defaultAddressDetails: string;
};

export async function updateDefaultAddress(
  userId: string,
  input: UpdateDefaultAddressInput,
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      default_address: input.defaultAddress.trim(),
      default_address_details: input.defaultAddressDetails.trim() || null,
    })
    .eq('id', userId)
    .select('*')
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("L'adresse n’a pas pu être mise à jour.");
  }

  return data as ProfileRow;
}
