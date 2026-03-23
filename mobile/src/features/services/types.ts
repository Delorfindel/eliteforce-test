export type ServiceCategory = {
  created_at: string;
  icon_key: string;
  id: number;
  name: string;
  slug: string;
  sort_order: number;
};

export type ServiceRecord = {
  base_price: number;
  category_id: number;
  category_name?: string;
  category_slug?: string;
  featured_rank: number | null;
  id: number;
  image_url: string | null;
  is_active: boolean;
  is_featured: boolean;
  name: string;
  rating: number;
  review_count: number;
  short_description: string;
  slug: string;
  updated_at: string;
};
