import type { Database } from "@/types/database.types";
import type {
  MarketplaceServiceCard,
  MarketplaceServiceDetail,
  ProviderServiceFormValues,
  ProviderServiceListItem,
  ProviderSummary,
  ServiceCategory,
  ServiceReview
} from "@/features/services/types";

type CategoryRow = Database["public"]["Tables"]["service_categories"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type ProviderProfileRow = Database["public"]["Tables"]["provider_profiles"]["Row"];
type ProviderServiceInsert = Database["public"]["Tables"]["provider_services"]["Insert"];
type ProviderServiceRow = Database["public"]["Tables"]["provider_services"]["Row"];
type ProviderServiceUpdate = Database["public"]["Tables"]["provider_services"]["Update"];
type ReviewRow = Database["public"]["Tables"]["service_reviews"]["Row"];

type NestedCategory = CategoryRow | CategoryRow[] | null;
type NestedProfile = ProfileRow | ProfileRow[] | null;
type NestedProviderProfile =
  | (ProviderProfileRow & { profiles: NestedProfile })
  | (ProviderProfileRow & { profiles: NestedProfile })[]
  | null;

export type MarketplaceServiceRow = ProviderServiceRow & {
  category: NestedCategory;
  provider: NestedProviderProfile;
};

export type ProviderServiceListRow = ProviderServiceRow & {
  category: NestedCategory;
};

function unwrapSingle<T>(value: T | T[] | null): T | null {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value;
}

function mapCategory(value: NestedCategory): ServiceCategory {
  const category = unwrapSingle(value);

  if (!category) {
    throw new Error("Marketplace category is missing.");
  }

  return category;
}

function mapProvider(value: NestedProviderProfile): ProviderSummary {
  const providerProfile = unwrapSingle(value);
  const profile = unwrapSingle(providerProfile?.profiles ?? null);

  if (!providerProfile) {
    throw new Error("Marketplace provider is missing.");
  }

  const fullName = [profile?.first_name, profile?.last_name]
    .map((segment) => segment?.trim() ?? "")
    .filter(Boolean)
    .join(" ");

  return {
    avatar_url: providerProfile.avatar_url,
    bio: providerProfile.bio,
    completed_missions_count: providerProfile.completed_missions_count,
    // `profiles` can be hidden by RLS for other users, even when the provider
    // profile itself is visible in the marketplace.
    full_name: fullName || "Prestataire EliteForce",
    headline: providerProfile.headline,
    member_since: providerProfile.created_at,
    profile_id: providerProfile.profile_id,
    rating: providerProfile.rating,
    review_count: providerProfile.review_count
  };
}

export function mapMarketplaceServiceCard(
  value: MarketplaceServiceRow
): MarketplaceServiceCard {
  return {
    category: mapCategory(value.category),
    cover_image_url: value.cover_image_url,
    created_at: value.created_at,
    hourly_rate: value.hourly_rate,
    id: value.id,
    is_active: value.is_active,
    provider: mapProvider(value.provider),
    rating: value.rating,
    review_count: value.review_count,
    short_description: value.short_description,
    slug: value.slug,
    title: value.title,
    updated_at: value.updated_at
  };
}

export function mapMarketplaceServiceDetail(
  value: MarketplaceServiceRow,
  reviews: ReviewRow[]
): MarketplaceServiceDetail {
  return {
    ...mapMarketplaceServiceCard(value),
    description: value.description,
    reviews: reviews.map(mapServiceReview)
  };
}

export function mapProviderServiceListItem(
  value: ProviderServiceListRow
): ProviderServiceListItem {
  return {
    category: mapCategory(value.category),
    cover_image_url: value.cover_image_url,
    description: value.description,
    hourly_rate: value.hourly_rate,
    id: value.id,
    is_active: value.is_active,
    rating: value.rating,
    review_count: value.review_count,
    short_description: value.short_description,
    slug: value.slug,
    title: value.title,
    updated_at: value.updated_at
  };
}

export function mapServiceReview(value: ReviewRow): ServiceReview {
  return {
    author_name: value.author_name,
    comment: value.comment,
    created_at: value.created_at,
    id: value.id,
    rating: value.rating
  };
}

export function slugifyTitle(title: string) {
  return title
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function createProviderServiceInsert(
  input: ProviderServiceFormValues,
  providerId: string
): ProviderServiceInsert {
  const slugBase = slugifyTitle(input.title) || "service";

  return {
    category_id: input.categoryId,
    cover_image_url: input.coverImageUrl.trim() || null,
    description: input.description.trim(),
    hourly_rate: input.hourlyRate,
    is_active: input.isActive,
    provider_id: providerId,
    short_description: input.shortDescription.trim(),
    slug: `${slugBase}-${Date.now().toString(36)}`,
    title: input.title.trim()
  };
}

export function createProviderServiceUpdate(
  input: ProviderServiceFormValues
): ProviderServiceUpdate {
  return {
    category_id: input.categoryId,
    cover_image_url: input.coverImageUrl.trim() || null,
    description: input.description.trim(),
    hourly_rate: input.hourlyRate,
    is_active: input.isActive,
    short_description: input.shortDescription.trim(),
    title: input.title.trim()
  };
}

export const marketplaceCardSelect = `
  id,
  category_id,
  cover_image_url,
  created_at,
  description,
  hourly_rate,
  is_active,
  provider_id,
  rating,
  review_count,
  short_description,
  slug,
  title,
  updated_at,
  category:service_categories!provider_services_category_id_fkey (
    created_at,
    icon_key,
    id,
    name,
    slug,
    sort_order
  ),
  provider:provider_profiles!provider_services_provider_id_fkey (
    avatar_url,
    bio,
    completed_missions_count,
    created_at,
    headline,
    is_active,
    profile_id,
    rating,
    review_count,
    updated_at,
    profiles:profiles!provider_profiles_profile_id_fkey (
      created_at,
      email,
      first_name,
      id,
      last_name,
      phone,
      role,
      accepted_terms_at,
      updated_at
    )
  )
`;

export const providerServiceListSelect = `
  id,
  category_id,
  cover_image_url,
  created_at,
  description,
  hourly_rate,
  is_active,
  provider_id,
  rating,
  review_count,
  short_description,
  slug,
  title,
  updated_at,
  category:service_categories!provider_services_category_id_fkey (
    created_at,
    icon_key,
    id,
    name,
    slug,
    sort_order
  )
`;
