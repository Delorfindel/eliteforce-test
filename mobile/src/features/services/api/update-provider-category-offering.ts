import {
  createProviderCategoryOfferingUpdate,
  mapProviderCategoryOfferingListItem,
  type ProviderOfferingListRow,
  providerOfferingListSelect,
} from '@/features/services/api/tasker-shared';
import type {
  ProviderCategoryOfferingFormValues,
  ProviderCategoryOfferingListItem,
} from '@/features/services/types';
import { supabase } from '@/lib/supabase';

export async function updateProviderCategoryOffering(
  offeringId: number,
  input: ProviderCategoryOfferingFormValues,
): Promise<ProviderCategoryOfferingListItem> {
  const { data, error } = await supabase
    .from('provider_category_offerings')
    .update(createProviderCategoryOfferingUpdate(input))
    .eq('id', offeringId)
    .select(providerOfferingListSelect)
    .maybeSingle();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Cette catégorie est déjà configurée sur un autre bloc de votre profil.');
    }

    throw error;
  }

  if (!data) {
    throw new Error('La catégorie n’a pas pu être mise à jour.');
  }

  return mapProviderCategoryOfferingListItem(data as ProviderOfferingListRow);
}
