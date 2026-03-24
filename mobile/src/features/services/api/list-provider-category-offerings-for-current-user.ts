import {
  mapProviderCategoryOfferingListItem,
  type ProviderOfferingListRow,
  providerOfferingListSelect,
} from '@/features/services/api/tasker-shared';
import type { ProviderCategoryOfferingListItem } from '@/features/services/types';
import { supabase } from '@/lib/supabase';

export async function listProviderCategoryOfferingsForCurrentUser(
  providerId: string,
): Promise<ProviderCategoryOfferingListItem[]> {
  const { data, error } = await supabase
    .from('provider_category_offerings')
    .select(providerOfferingListSelect)
    .eq('provider_id', providerId)
    .order('updated_at', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) =>
    mapProviderCategoryOfferingListItem(item as ProviderOfferingListRow),
  );
}
