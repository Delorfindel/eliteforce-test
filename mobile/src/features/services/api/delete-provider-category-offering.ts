import { supabase } from '@/lib/supabase';

export async function deleteProviderCategoryOffering(offeringId: number): Promise<void> {
  const { error } = await supabase
    .from('provider_category_offerings')
    .delete()
    .eq('id', offeringId);

  if (error) {
    throw error;
  }
}
