export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          accepted_terms_at: string;
          created_at: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          phone: string;
          role: string;
          updated_at: string;
        };
        Insert: {
          accepted_terms_at: string;
          created_at?: string;
          email: string;
          first_name: string;
          id: string;
          last_name: string;
          phone: string;
          role?: string;
          updated_at?: string;
        };
        Update: {
          accepted_terms_at?: string;
          created_at?: string;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          phone?: string;
          role?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["id"];
            foreignKeyName: "profiles_id_fkey";
            isOneToOne: true;
            referencedColumns: ["id"];
            referencedRelation: "users";
            referencedSchema: "auth";
          }
        ];
      };
      service_categories: {
        Row: {
          created_at: string;
          icon_key: string;
          id: number;
          name: string;
          slug: string;
          sort_order: number;
        };
        Insert: {
          created_at?: string;
          icon_key: string;
          id?: never;
          name: string;
          slug: string;
          sort_order: number;
        };
        Update: {
          created_at?: string;
          icon_key?: string;
          id?: never;
          name?: string;
          slug?: string;
          sort_order?: number;
        };
        Relationships: [];
      };
      services: {
        Row: {
          base_price: number;
          category_id: number;
          created_at: string;
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
        Insert: {
          base_price: number;
          category_id: number;
          created_at?: string;
          featured_rank?: number | null;
          id?: never;
          image_url?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          name: string;
          rating?: number;
          review_count?: number;
          short_description: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          base_price?: number;
          category_id?: number;
          created_at?: string;
          featured_rank?: number | null;
          id?: never;
          image_url?: string | null;
          is_active?: boolean;
          is_featured?: boolean;
          name?: string;
          rating?: number;
          review_count?: number;
          short_description?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            columns: ["category_id"];
            foreignKeyName: "services_category_id_fkey";
            isOneToOne: false;
            referencedColumns: ["id"];
            referencedRelation: "service_categories";
            referencedSchema: "public";
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
