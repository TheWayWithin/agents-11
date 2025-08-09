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
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          username: string | null;
          bio: string | null;
          website: string | null;
          location: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          username?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          username?: string | null;
          bio?: string | null;
          website?: string | null;
          location?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      libraries: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string;
          long_description: string | null;
          category: Database['public']['Enums']['library_category'];
          tier_required: Database['public']['Enums']['subscription_tier'];
          version: string;
          download_url: string;
          file_size: number | null;
          tags: string[];
          author_id: string | null;
          featured: boolean;
          published: boolean;
          download_count: number;
          rating: number;
          rating_count: number;
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description: string;
          long_description?: string | null;
          category?: Database['public']['Enums']['library_category'];
          tier_required?: Database['public']['Enums']['subscription_tier'];
          version?: string;
          download_url: string;
          file_size?: number | null;
          tags?: string[];
          author_id?: string | null;
          featured?: boolean;
          published?: boolean;
          download_count?: number;
          rating?: number;
          rating_count?: number;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string;
          long_description?: string | null;
          category?: Database['public']['Enums']['library_category'];
          tier_required?: Database['public']['Enums']['subscription_tier'];
          version?: string;
          download_url?: string;
          file_size?: number | null;
          tags?: string[];
          author_id?: string | null;
          featured?: boolean;
          published?: boolean;
          download_count?: number;
          rating?: number;
          rating_count?: number;
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'libraries_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          tier: Database['public']['Enums']['subscription_tier'];
          status: Database['public']['Enums']['subscription_status'];
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stripe_subscription_id: string;
          stripe_customer_id: string;
          tier: Database['public']['Enums']['subscription_tier'];
          status: Database['public']['Enums']['subscription_status'];
          current_period_start: string;
          current_period_end: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          stripe_subscription_id?: string;
          stripe_customer_id?: string;
          tier?: Database['public']['Enums']['subscription_tier'];
          status?: Database['public']['Enums']['subscription_status'];
          current_period_start?: string;
          current_period_end?: string;
          cancel_at_period_end?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'subscriptions_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      downloads: {
        Row: {
          id: string;
          user_id: string;
          library_id: string;
          downloaded_at: string;
          ip_address: string | null;
          user_agent: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          library_id: string;
          downloaded_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          library_id?: string;
          downloaded_at?: string;
          ip_address?: string | null;
          user_agent?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'downloads_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'downloads_library_id_fkey';
            columns: ['library_id'];
            isOneToOne: false;
            referencedRelation: 'libraries';
            referencedColumns: ['id'];
          },
        ];
      };
      library_ratings: {
        Row: {
          id: string;
          user_id: string;
          library_id: string;
          rating: number;
          review: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          library_id: string;
          rating: number;
          review?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          library_id?: string;
          rating?: number;
          review?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'library_ratings_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'library_ratings_library_id_fkey';
            columns: ['library_id'];
            isOneToOne: false;
            referencedRelation: 'libraries';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      user_library_access: {
        Row: {
          library_id: string | null;
          library_name: string | null;
          slug: string | null;
          description: string | null;
          category: Database['public']['Enums']['library_category'] | null;
          tier_required:
            | Database['public']['Enums']['subscription_tier']
            | null;
          published: boolean | null;
          featured: boolean | null;
          download_count: number | null;
          rating: number | null;
          rating_count: number | null;
          library_created_at: string | null;
          author_id: string | null;
          author_name: string | null;
          author_username: string | null;
          user_id: string | null;
          user_email: string | null;
          subscription_id: string | null;
          user_tier: Database['public']['Enums']['subscription_tier'] | null;
          subscription_status:
            | Database['public']['Enums']['subscription_status']
            | null;
          current_period_end: string | null;
          has_access: boolean | null;
          has_downloaded: boolean | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      user_can_access_library: {
        Args: {
          p_user_id: string;
          p_library_id: string;
        };
        Returns: boolean;
      };
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      subscription_tier: 'basic' | 'pro' | 'enterprise';
      subscription_status:
        | 'active'
        | 'canceled'
        | 'past_due'
        | 'unpaid'
        | 'incomplete'
        | 'incomplete_expired'
        | 'trialing';
      library_category:
        | 'data_processing'
        | 'automation'
        | 'analysis'
        | 'integration'
        | 'communication'
        | 'utilities'
        | 'other';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

// Convenience type exports
export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
        Database['public']['Views'])
    ? (Database['public']['Tables'] &
        Database['public']['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
    ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
    ? Database['public']['Enums'][PublicEnumNameOrOptions]
    : never;

// Specific table type exports for convenience
export type Profile = Tables<'profiles'>;
export type Library = Tables<'libraries'>;
export type Subscription = Tables<'subscriptions'>;
export type Download = Tables<'downloads'>;
export type LibraryRating = Tables<'library_ratings'>;
export type UserLibraryAccess = Tables<'user_library_access'>;

export type ProfileInsert = TablesInsert<'profiles'>;
export type LibraryInsert = TablesInsert<'libraries'>;
export type SubscriptionInsert = TablesInsert<'subscriptions'>;
export type DownloadInsert = TablesInsert<'downloads'>;
export type LibraryRatingInsert = TablesInsert<'library_ratings'>;

export type ProfileUpdate = TablesUpdate<'profiles'>;
export type LibraryUpdate = TablesUpdate<'libraries'>;
export type SubscriptionUpdate = TablesUpdate<'subscriptions'>;
export type DownloadUpdate = TablesUpdate<'downloads'>;
export type LibraryRatingUpdate = TablesUpdate<'library_ratings'>;

export type SubscriptionTier = Enums<'subscription_tier'>;
export type SubscriptionStatus = Enums<'subscription_status'>;
export type LibraryCategory = Enums<'library_category'>;
