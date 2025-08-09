import type { SubscriptionTier } from '@/types';

// Map business tiers to database enum values
export const TIER_MAP: Record<
  'starter' | 'professional' | 'unlimited',
  SubscriptionTier
> = {
  starter: 'basic',
  professional: 'pro',
  unlimited: 'enterprise',
} as const;

// Reverse mapping for display purposes
export const TIER_DISPLAY_MAP: Record<SubscriptionTier, string> = {
  basic: 'Starter',
  pro: 'Professional',
  enterprise: 'Unlimited',
} as const;

export interface SubscriptionPlan {
  name: string;
  tier: SubscriptionTier;
  price: number;
  priceId: string; // Will be set via environment variables
  features: string[];
  libraryAccess: string;
  mostPopular?: boolean;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    name: 'Starter',
    tier: 'basic',
    price: 995, // $9.95 in cents
    priceId: process.env.STRIPE_STARTER_PRICE_ID || '',
    libraryAccess: '1 library access',
    features: [
      'Access to 1 AI agent library',
      'ZIP file downloads',
      'Basic documentation',
      'Community support',
      'Cancel anytime',
    ],
  },
  {
    name: 'Professional',
    tier: 'pro',
    price: 1995, // $19.95 in cents
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID || '',
    libraryAccess: '3 libraries access',
    mostPopular: true,
    features: [
      'Access to 3 AI agent libraries',
      'ZIP file downloads',
      'Premium documentation',
      'Priority support',
      'Usage analytics',
      'Cancel anytime',
    ],
  },
  {
    name: 'Unlimited',
    tier: 'enterprise',
    price: 3995, // $39.95 in cents
    priceId: process.env.STRIPE_UNLIMITED_PRICE_ID || '',
    libraryAccess: 'All libraries',
    features: [
      'Access to all AI agent libraries',
      'ZIP file downloads',
      'Premium documentation',
      'Priority support',
      'Usage analytics',
      'Early access to new libraries',
      'Cancel anytime',
    ],
  },
];

// Helper functions
export const getPlanByTier = (
  tier: SubscriptionTier
): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find(plan => plan.tier === tier);
};

export const getPlanByPriceId = (
  priceId: string
): SubscriptionPlan | undefined => {
  return SUBSCRIPTION_PLANS.find(plan => plan.priceId === priceId);
};

export const formatPrice = (priceInCents: number): string => {
  return `$${(priceInCents / 100).toFixed(2)}`;
};

export const getLibraryAccessCount = (
  tier: SubscriptionTier
): number | 'unlimited' => {
  switch (tier) {
    case 'basic':
      return 1;
    case 'pro':
      return 3;
    case 'enterprise':
      return 'unlimited';
    default:
      return 0;
  }
};
