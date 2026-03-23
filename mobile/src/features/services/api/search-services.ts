import type { SearchFilters } from "@/store/search-filters-store";
import type { ServiceRecord } from "@/features/services/types";
import { supabase } from "@/lib/supabase";

export type SearchServicesInput = SearchFilters & {
  query: string;
};

export async function searchServices(
  filters: SearchServicesInput
): Promise<ServiceRecord[]> {
  let query = supabase
    .from("services")
    .select("*")
    .eq("is_active", true)
    .gte("rating", filters.minRating)
    .gte("base_price", filters.minPrice)
    .order("is_featured", { ascending: false })
    .order("featured_rank", { ascending: true, nullsFirst: false })
    .order("rating", { ascending: false })
    .order("review_count", { ascending: false })
    .order("base_price", { ascending: true });

  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters.maxPrice !== null) {
    query = query.lte("base_price", filters.maxPrice);
  }

  if (filters.query.trim()) {
    const searchTerm = filters.query.trim();
    query = query.or(
      `name.ilike.%${searchTerm}%,short_description.ilike.%${searchTerm}%`
    );
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as ServiceRecord[];
}
