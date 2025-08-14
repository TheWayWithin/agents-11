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
  limitations?: string[];
  libraryAccess: string;
  mostPopular?: boolean;
  bestValue?: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
  conversionMessage?: string;
  selectRate?: string;
  valuePerAgent?: string;
  ctaText?: string;
  ctaVariant?: 'default' | 'outline';
  upgradeRate?: string;
  socialProof?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    name: 'Single Agent',
    tier: 'basic',
    price: 995, // $9.95 in cents
    priceId: process.env.STRIPE_SINGLE_PRICE_ID || '',
    libraryAccess: '1 agent only',
    features: [
      'Access to 1 chosen agent',
      'Basic ZIP download',
      'Community forum access',
      'Email support only',
    ],
    limitations: [
      'No access to other agents',
      'No future updates',
      'No priority support',
      'No analytics dashboard',
    ],
    riskLevel: 'high',
    conversionMessage: 'Risky for serious business',
    selectRate: '3%',
    valuePerAgent: '$9.95',
    ctaText: 'Try Risk',
    ctaVariant: 'outline',
  },
  {
    name: 'Category Access',
    tier: 'pro',
    price: 1995, // $19.95 in cents
    priceId: process.env.STRIPE_CATEGORY_PRICE_ID || '',
    libraryAccess: '1 category (~20 agents)',
    features: [
      'Access to 1 complete category',
      'Premium ZIP downloads',
      'Basic analytics dashboard',
      'Priority email support',
      'Category-specific updates',
    ],
    limitations: [
      'Missing 480+ other agents',
      'Limited to one category',
      'No cross-category features',
      'No advanced analytics',
    ],
    riskLevel: 'medium',
    conversionMessage: 'Limiting your potential',
    selectRate: '12%',
    valuePerAgent: '$1.00',
    ctaText: 'Choose Limited',
    ctaVariant: 'outline',
    upgradeRate: '73% upgrade within 30 days',
  },
  {
    name: 'Unlimited Access',
    tier: 'enterprise',
    price: 3995, // $39.95 in cents
    priceId: process.env.STRIPE_UNLIMITED_PRICE_ID || '',
    libraryAccess: 'All 500+ agents',
    mostPopular: true,
    bestValue: true,
    features: [
      'Access to all 500+ agents',
      'All future agents included',
      'Advanced analytics & insights',
      'Priority support & training',
      'Early access to new features',
      'Success coaching sessions',
      'Full community access',
      'Custom implementation help',
    ],
    limitations: [],
    riskLevel: 'low',
    conversionMessage: 'Everything you need to dominate',
    selectRate: '85%',
    valuePerAgent: '$0.08',
    ctaText: 'JOIN 85%',
    ctaVariant: 'default',
    socialProof: 'Most successful entrepreneurs choose this',
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
