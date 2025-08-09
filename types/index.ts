// Re-export database types from supabase
export * from './supabase';
import {
  LibraryCategory,
  SubscriptionTier,
  SubscriptionStatus,
} from './supabase';

// Additional application-specific types
export interface AgentLibrary {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description?: string | null;
  category: LibraryCategory;
  tier_required: SubscriptionTier;
  version: string;
  download_url: string;
  file_size?: number | null;
  tags: string[];
  author_id?: string | null;
  author_name?: string;
  author_username?: string;
  featured: boolean;
  published: boolean;
  download_count: number;
  rating: number;
  rating_count: number;
  created_at: string;
  updated_at: string;
  published_at?: string | null;
}

export interface UserProfile {
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
}

export interface UserSubscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

// Stripe Types
export interface CreateCheckoutSessionRequest {
  tier: SubscriptionTier;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CreateCheckoutSessionResponse {
  sessionId: string;
  url: string | null;
}

export interface CreatePortalSessionRequest {
  returnUrl?: string;
}

export interface CreatePortalSessionResponse {
  url: string;
}

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
}

export interface SubscriptionPlan {
  name: string;
  tier: SubscriptionTier;
  price: number;
  priceId: string;
  features: string[];
  libraryAccess: string;
  mostPopular?: boolean;
}

// Form Types
export interface LibrarySearchFilters {
  category?: LibraryCategory;
  tier?: SubscriptionTier;
  featured?: boolean;
  search?: string;
  author?: string;
  tags?: string[];
  sortBy?: 'newest' | 'oldest' | 'popular' | 'rating' | 'name';
}

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
