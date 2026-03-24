import {
  createProviderCategoryOfferingInsert,
  mapProviderCategoryOfferingListItem,
  type ProviderOfferingListRow,
  providerOfferingListSelect,
} from '@/features/services/api/tasker-shared';
import type {
  ProviderCategoryOfferingFormValues,
  ProviderCategoryOfferingListItem,
} from '@/features/services/types';
import { supabase } from '@/lib/supabase';

export async function createProviderCategoryOffering(
  providerId: string,
  input: ProviderCategoryOfferingFormValues,
): Promise<ProviderCategoryOfferingListItem> {
  const { data, error } = await supabase
    .from('provider_category_offerings')
    .insert(createProviderCategoryOfferingInsert(input, providerId))
    .select(providerOfferingListSelect)
    .maybeSingle();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Cette catégorie est déjà configurée. Modifiez-la plutôt que de la recréer.');
    }

    throw error;
  }

  if (!data) {
    throw new Error('La catégorie n’a pas pu être ajoutée.');
  }

  return mapProviderCategoryOfferingListItem(data as ProviderOfferingListRow);
}
