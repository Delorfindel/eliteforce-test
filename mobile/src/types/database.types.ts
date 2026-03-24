export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      profiles: {
        Row: {
          accepted_terms_at: string;
          created_at: string;
          default_address: string | null;
          default_address_details: string | null;
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
          default_address?: string | null;
          default_address_details?: string | null;
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
          default_address?: string | null;
          default_address_details?: string | null;
          email?: string;
          first_name?: string;
          id?: string;
          last_name?: string;
          phone?: string;
          role?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      provider_profiles: {
        Row: {
          avatar_url: string | null;
          bio: string;
          completed_missions_count: number;
          created_at: string;
          headline: string;
          is_active: boolean;
          is_elite: boolean;
          languages: string[];
          profile_id: string;
          rating: number;
          review_count: number;
          tools: string[];
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          bio: string;
          completed_missions_count?: number;
          created_at?: string;
          headline: string;
          is_active?: boolean;
          is_elite?: boolean;
          languages?: string[];
          profile_id: string;
          rating?: number;
          review_count?: number;
          tools?: string[];
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          bio?: string;
          completed_missions_count?: number;
          created_at?: string;
          headline?: string;
          is_active?: boolean;
          is_elite?: boolean;
          languages?: string[];
          profile_id?: string;
          rating?: number;
          review_count?: number;
          tools?: string[];
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'provider_profiles_profile_id_fkey';
            columns: ['profile_id'];
            isOneToOne: true;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      provider_category_offerings: {
        Row: {
          category_id: number;
          completed_task_count: number;
          created_at: string;
          hourly_rate: number;
          id: number;
          is_active: boolean;
          next_available_at: string | null;
          provider_id: string;
          updated_at: string;
        };
        Insert: {
          category_id: number;
          completed_task_count?: number;
          created_at?: string;
          hourly_rate: number;
          id?: never;
          is_active?: boolean;
          next_available_at?: string | null;
          provider_id: string;
          updated_at?: string;
        };
        Update: {
          category_id?: number;
          completed_task_count?: number;
          created_at?: string;
          hourly_rate?: number;
          id?: never;
          is_active?: boolean;
          next_available_at?: string | null;
          provider_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'provider_category_offerings_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'service_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'provider_category_offerings_provider_id_fkey';
            columns: ['provider_id'];
            isOneToOne: false;
            referencedRelation: 'provider_profiles';
            referencedColumns: ['profile_id'];
          },
        ];
      };
      provider_reviews: {
        Row: {
          author_name: string;
          category_id: number | null;
          comment: string;
          created_at: string;
          id: number;
          provider_id: string;
          rating: number;
        };
        Insert: {
          author_name: string;
          category_id?: number | null;
          comment: string;
          created_at?: string;
          id?: never;
          provider_id: string;
          rating: number;
        };
        Update: {
          author_name?: string;
          category_id?: number | null;
          comment?: string;
          created_at?: string;
          id?: never;
          provider_id?: string;
          rating?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'provider_reviews_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'service_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'provider_reviews_provider_id_fkey';
            columns: ['provider_id'];
            isOneToOne: false;
            referencedRelation: 'provider_profiles';
            referencedColumns: ['profile_id'];
          },
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
      task_bookings: {
        Row: {
          address: string;
          address_details: string | null;
          category_id: number;
          client_id: string;
          created_at: string;
          currency_code: string;
          hourly_rate: number;
          id: number;
          notes: string | null;
          offering_id: number | null;
          payment_status: string;
          provider_id: string;
          scheduled_for: string;
          status: string;
          total_price: number;
          updated_at: string;
        };
        Insert: {
          address: string;
          address_details?: string | null;
          category_id: number;
          client_id: string;
          created_at?: string;
          currency_code?: string;
          hourly_rate: number;
          id?: never;
          notes?: string | null;
          offering_id?: number | null;
          payment_status?: string;
          provider_id: string;
          scheduled_for: string;
          status?: string;
          total_price: number;
          updated_at?: string;
        };
        Update: {
          address?: string;
          address_details?: string | null;
          category_id?: number;
          client_id?: string;
          created_at?: string;
          currency_code?: string;
          hourly_rate?: number;
          id?: never;
          notes?: string | null;
          offering_id?: number | null;
          payment_status?: string;
          provider_id?: string;
          scheduled_for?: string;
          status?: string;
          total_price?: number;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'task_bookings_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'service_categories';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_bookings_client_id_fkey';
            columns: ['client_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_bookings_offering_id_fkey';
            columns: ['offering_id'];
            isOneToOne: false;
            referencedRelation: 'provider_category_offerings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'task_bookings_provider_id_fkey';
            columns: ['provider_id'];
            isOneToOne: false;
            referencedRelation: 'provider_profiles';
            referencedColumns: ['profile_id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  storage: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
  storage: {
    Enums: {},
  },
} as const;
