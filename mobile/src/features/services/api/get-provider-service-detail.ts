import type {
  MarketplaceServiceDetail,
  ServiceReview
} from "@/features/services/types";
import { supabase } from "@/lib/supabase";
import {
  mapMarketplaceServiceDetail,
  mapServiceReview,
  marketplaceCardSelect,
  type MarketplaceServiceRow
} from "@/features/services/api/shared";
import type { Database } from "@/types/database.types";

type ReviewRow = Database["public"]["Tables"]["service_reviews"]["Row"];

export async function getProviderServiceDetail(
  slug: string
): Promise<MarketplaceServiceDetail | null> {
  const { data, error } = await supabase
    .from("provider_services")
    .select(marketplaceCardSelect)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const { data: reviews, error: reviewsError } = await supabase
    .from("service_reviews")
    .select("*")
    .eq("service_id", data.id)
    .order("created_at", { ascending: false });

  if (reviewsError) {
    throw reviewsError;
  }

  return mapMarketplaceServiceDetail(
    data as MarketplaceServiceRow,
    (reviews ?? []) as ReviewRow[]
  );
}

export async function listServiceReviews(serviceId: number): Promise<ServiceReview[]> {
  const { data, error } = await supabase
    .from("service_reviews")
    .select("*")
    .eq("service_id", serviceId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map((item) => mapServiceReview(item as ReviewRow));
}
