export type ServiceCategory = {
  created_at: string;
  icon_key: string;
  id: number;
  name: string;
  slug: string;
  sort_order: number;
};

export type ProviderSummary = {
  avatar_url: string | null;
  bio: string;
  completed_missions_count: number;
  full_name: string;
  headline: string;
  member_since: string;
  profile_id: string;
  rating: number;
  review_count: number;
};

export type MarketplaceServiceCard = {
  category: ServiceCategory;
  cover_image_url: string | null;
  created_at: string;
  hourly_rate: number;
  id: number;
  is_active: boolean;
  provider: ProviderSummary;
  rating: number;
  review_count: number;
  short_description: string;
  slug: string;
  title: string;
  updated_at: string;
};

export type ServiceReview = {
  author_name: string;
  comment: string;
  created_at: string;
  id: number;
  rating: number;
};

export type MarketplaceServiceDetail = MarketplaceServiceCard & {
  description: string;
  reviews: ServiceReview[];
};

export type ProviderServiceListItem = {
  category: ServiceCategory;
  cover_image_url: string | null;
  description: string;
  hourly_rate: number;
  id: number;
  is_active: boolean;
  rating: number;
  review_count: number;
  short_description: string;
  slug: string;
  title: string;
  updated_at: string;
};

export type ProviderServiceFormValues = {
  categoryId: number;
  coverImageUrl: string;
  description: string;
  hourlyRate: number;
  isActive: boolean;
  shortDescription: string;
  title: string;
};
