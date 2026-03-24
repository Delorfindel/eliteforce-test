import type {
  ProviderCategoryOfferingFormValues,
  ProviderCategoryOfferingListItem,
  ProviderReview,
  ProviderSummary,
  ServiceCategory,
  TaskBooking,
  TaskerProfile,
  TaskerSearchResult,
} from '@/features/services/types';
import type { Database } from '@/types/database.types';

type CategoryRow = Database['public']['Tables']['service_categories']['Row'];
type ProfileRow = Database['public']['Tables']['profiles']['Row'];
type ProviderProfileRow = Database['public']['Tables']['provider_profiles']['Row'];
type ProviderOfferingInsert = Database['public']['Tables']['provider_category_offerings']['Insert'];
type ProviderOfferingRow = Database['public']['Tables']['provider_category_offerings']['Row'];
type ProviderOfferingUpdate = Database['public']['Tables']['provider_category_offerings']['Update'];
type ProviderReviewRow = Database['public']['Tables']['provider_reviews']['Row'];
type TaskBookingRow = Database['public']['Tables']['task_bookings']['Row'];

type NestedCategory = CategoryRow | CategoryRow[] | null;
type NestedProfile = ProfileRow | ProfileRow[] | null;
type NestedProviderProfile =
  | (ProviderProfileRow & { profiles: NestedProfile })
  | (ProviderProfileRow & { profiles: NestedProfile })[]
  | null;

export type TaskerOfferingRow = ProviderOfferingRow & {
  category: NestedCategory;
  provider: NestedProviderProfile;
};

export type ProviderOfferingListRow = ProviderOfferingRow & {
  category: NestedCategory;
};

export type TaskBookingQueryRow = TaskBookingRow & {
  category: NestedCategory;
  provider: NestedProviderProfile;
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
    throw new Error('Marketplace category is missing.');
  }

  return category;
}

function mapProvider(value: NestedProviderProfile): ProviderSummary {
  const providerProfile = unwrapSingle(value);
  const profile = unwrapSingle(providerProfile?.profiles ?? null);

  if (!providerProfile) {
    throw new Error('Marketplace provider is missing.');
  }

  const fullName = [profile?.first_name, profile?.last_name]
    .map((segment) => segment?.trim() ?? '')
    .filter(Boolean)
    .join(' ');

  return {
    avatar_url: providerProfile.avatar_url,
    bio: providerProfile.bio,
    completed_missions_count: providerProfile.completed_missions_count,
    full_name: fullName || 'Prestataire EliteForce',
    headline: providerProfile.headline,
    is_elite: providerProfile.is_elite,
    languages: providerProfile.languages,
    member_since: providerProfile.created_at,
    profile_id: providerProfile.profile_id,
    rating: providerProfile.rating,
    review_count: providerProfile.review_count,
    tools: providerProfile.tools,
  };
}

export function mapProviderReview(value: ProviderReviewRow): ProviderReview {
  return {
    author_name: value.author_name,
    category_id: value.category_id,
    comment: value.comment,
    created_at: value.created_at,
    id: value.id,
    rating: value.rating,
  };
}

export function mapTaskerSearchResult(value: TaskerOfferingRow): TaskerSearchResult {
  return {
    category: mapCategory(value.category),
    completed_task_count: value.completed_task_count,
    hourly_rate: value.hourly_rate,
    id: value.id,
    is_active: value.is_active,
    next_available_at: value.next_available_at,
    provider: mapProvider(value.provider),
  };
}

export function mapTaskerProfile(
  value: TaskerOfferingRow,
  reviews: ProviderReviewRow[],
): TaskerProfile {
  return {
    ...mapTaskerSearchResult(value),
    reviews: reviews.map(mapProviderReview),
  };
}

export function mapProviderCategoryOfferingListItem(
  value: ProviderOfferingListRow,
): ProviderCategoryOfferingListItem {
  return {
    category: mapCategory(value.category),
    completed_task_count: value.completed_task_count,
    hourly_rate: value.hourly_rate,
    id: value.id,
    is_active: value.is_active,
    next_available_at: value.next_available_at,
    updated_at: value.updated_at,
  };
}

export function mapTaskBooking(value: TaskBookingQueryRow): TaskBooking {
  return {
    address: value.address,
    address_details: value.address_details,
    category: mapCategory(value.category),
    created_at: value.created_at,
    currency_code: value.currency_code,
    hourly_rate: value.hourly_rate,
    id: value.id,
    notes: value.notes,
    payment_status: value.payment_status,
    provider: mapProvider(value.provider),
    scheduled_for: value.scheduled_for,
    status: value.status,
    total_price: value.total_price,
  };
}

export function createProviderCategoryOfferingInsert(
  input: ProviderCategoryOfferingFormValues,
  providerId: string,
): ProviderOfferingInsert {
  return {
    category_id: input.categoryId,
    hourly_rate: input.hourlyRate,
    is_active: input.isActive,
    next_available_at: input.nextAvailableAt,
    provider_id: providerId,
  };
}

export function createProviderCategoryOfferingUpdate(
  input: ProviderCategoryOfferingFormValues,
): ProviderOfferingUpdate {
  return {
    category_id: input.categoryId,
    hourly_rate: input.hourlyRate,
    is_active: input.isActive,
    next_available_at: input.nextAvailableAt,
  };
}

const providerSelect = `
  avatar_url,
  bio,
  completed_missions_count,
  created_at,
  headline,
  is_active,
  is_elite,
  languages,
  profile_id,
  rating,
  review_count,
  tools,
  updated_at,
  profiles:profiles!provider_profiles_profile_id_fkey (
    accepted_terms_at,
    created_at,
    default_address,
    default_address_details,
    email,
    first_name,
    id,
    last_name,
    phone,
    role,
    updated_at
  )
`;

export const taskerOfferingSelect = `
  category_id,
  completed_task_count,
  created_at,
  hourly_rate,
  id,
  is_active,
  next_available_at,
  provider_id,
  updated_at,
  category:service_categories!provider_category_offerings_category_id_fkey (
    created_at,
    icon_key,
    id,
    name,
    slug,
    sort_order
  ),
  provider:provider_profiles!provider_category_offerings_provider_id_fkey (
    ${providerSelect}
  )
`;

export const providerOfferingListSelect = `
  category_id,
  completed_task_count,
  created_at,
  hourly_rate,
  id,
  is_active,
  next_available_at,
  provider_id,
  updated_at,
  category:service_categories!provider_category_offerings_category_id_fkey (
    created_at,
    icon_key,
    id,
    name,
    slug,
    sort_order
  )
`;

export const taskBookingSelect = `
  address,
  address_details,
  category_id,
  client_id,
  created_at,
  currency_code,
  hourly_rate,
  id,
  notes,
  offering_id,
  payment_status,
  provider_id,
  scheduled_for,
  status,
  total_price,
  updated_at,
  category:service_categories!task_bookings_category_id_fkey (
    created_at,
    icon_key,
    id,
    name,
    slug,
    sort_order
  ),
  provider:provider_profiles!task_bookings_provider_id_fkey (
    ${providerSelect}
  )
`;
