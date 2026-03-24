import {
  type MarketplaceServiceRow,
  mapMarketplaceServiceCard,
  marketplaceCardSelect,
} from '@/features/services/api/shared';
import type { MarketplaceServiceCard } from '@/features/services/types';
import { supabase } from '@/lib/supabase';

export async function listTopProviderServices(): Promise<MarketplaceServiceCard[]> {
  const { data, error } = await supabase
    .from('provider_services')
    .select(marketplaceCardSelect)
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .order('review_count', { ascending: false })
    .order('hourly_rate', { ascending: true })
    .limit(6);

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => mapMarketplaceServiceCard(item as MarketplaceServiceRow));
}
