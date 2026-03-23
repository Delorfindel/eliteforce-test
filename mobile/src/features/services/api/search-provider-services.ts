import type { SearchFilters } from "@/store/search-filters-store";
import type { MarketplaceServiceCard } from "@/features/services/types";
import { supabase } from "@/lib/supabase";
import {
  mapMarketplaceServiceCard,
  marketplaceCardSelect,
  type MarketplaceServiceRow
} from "@/features/services/api/shared";

export type SearchProviderServicesInput = SearchFilters & {
  query: string;
};

export async function searchProviderServices(
  filters: SearchProviderServicesInput
): Promise<MarketplaceServiceCard[]> {
  let query = supabase
    .from("provider_services")
    .select(marketplaceCardSelect)
    .eq("is_active", true)
    .gte("rating", filters.minRating)
    .gte("hourly_rate", filters.minPrice)
    .order("rating", { ascending: false })
    .order("review_count", { ascending: false })
    .order("hourly_rate", { ascending: true });

  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters.maxPrice !== null) {
    query = query.lte("hourly_rate", filters.maxPrice);
  }

  if (filters.query.trim()) {
    const searchTerm = filters.query.trim();
    query = query.or(
      `title.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) =>
    mapMarketplaceServiceCard(item as MarketplaceServiceRow)
  );
}
