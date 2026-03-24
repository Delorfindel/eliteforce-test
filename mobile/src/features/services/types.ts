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
  is_elite: boolean;
  languages: string[];
  member_since: string;
  profile_id: string;
  rating: number;
  review_count: number;
  tools: string[];
};

export type ProviderReview = {
  author_name: string;
  category_id: number | null;
  comment: string;
  created_at: string;
  id: number;
  rating: number;
};

export type TaskerSearchResult = {
  category: ServiceCategory;
  completed_task_count: number;
  hourly_rate: number;
  id: number;
  is_active: boolean;
  next_available_at: string | null;
  provider: ProviderSummary;
};

export type TaskerProfile = TaskerSearchResult & {
  reviews: ProviderReview[];
};

export type ProviderCategoryOfferingListItem = {
  category: ServiceCategory;
  completed_task_count: number;
  hourly_rate: number;
  id: number;
  is_active: boolean;
  next_available_at: string | null;
  updated_at: string;
};

export type ProviderCategoryOfferingFormValues = {
  categoryId: number;
  hourlyRate: number;
  isActive: boolean;
  nextAvailableAt: string | null;
};

export type TaskBooking = {
  address: string;
  address_details: string | null;
  category: ServiceCategory;
  created_at: string;
  currency_code: string;
  hourly_rate: number;
  id: number;
  notes: string | null;
  payment_status: string;
  provider: ProviderSummary;
  scheduled_for: string;
  status: string;
  total_price: number;
};

export type SavedAddress = {
  details: string;
  label: string;
};
