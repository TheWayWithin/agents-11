import { z } from 'zod';

export const subscriptionStatuses = [
  'active',
  'canceled',
  'past_due',
  'unpaid',
  'incomplete',
  'incomplete_expired',
  'trialing',
] as const;

// Import subscriptionTiers from library.ts to avoid duplication
import { subscriptionTiers } from './library';

export const subscriptionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  stripe_subscription_id: z.string(),
  stripe_customer_id: z.string(),
  tier: z.enum(subscriptionTiers),
  status: z.enum(subscriptionStatuses),
  current_period_start: z.string().datetime(),
  current_period_end: z.string().datetime(),
  cancel_at_period_end: z.boolean().default(false),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export const createSubscriptionSchema = z.object({
  tier: z.enum(subscriptionTiers, {
    message: 'Please select a subscription tier',
  }),
  payment_method_id: z.string().min(1, 'Payment method is required'),
});

export const updateSubscriptionSchema = z.object({
  tier: z.enum(subscriptionTiers).optional(),
  cancel_at_period_end: z.boolean().optional(),
});

export const stripeWebhookSchema = z.object({
  id: z.string(),
  object: z.literal('event'),
  type: z.string(),
  data: z.object({
    object: z.record(z.string(), z.any()),
  }),
});

// Subscription tier definitions for pricing and features
export const subscriptionTierConfig = {
  basic: {
    name: 'Basic',
    price: 9.95,
    stripePriceId: process.env.STRIPE_BASIC_PRICE_ID,
    features: [
      'Access to Basic tier libraries',
      'Up to 10 downloads per month',
      'Community support',
      'Email notifications',
    ],
    downloadLimit: 10,
  },
  pro: {
    name: 'Pro',
    price: 19.95,
    stripePriceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Access to Basic and Pro tier libraries',
      'Up to 50 downloads per month',
      'Priority support',
      'Early access to new libraries',
      'Custom library requests',
    ],
    downloadLimit: 50,
  },
  enterprise: {
    name: 'Enterprise',
    price: 39.95,
    stripePriceId: process.env.STRIPE_ENTERPRISE_PRICE_ID,
    features: [
      'Access to all libraries',
      'Unlimited downloads',
      'Priority support',
      'Early access to new libraries',
      'Custom library development',
      'Team management',
      'Usage analytics',
    ],
    downloadLimit: -1, // -1 means unlimited
  },
} as const;

export type Subscription = z.infer<typeof subscriptionSchema>;
export type CreateSubscriptionInput = z.infer<typeof createSubscriptionSchema>;
export type UpdateSubscriptionInput = z.infer<typeof updateSubscriptionSchema>;
export type StripeWebhookInput = z.infer<typeof stripeWebhookSchema>;
export type SubscriptionStatus = (typeof subscriptionStatuses)[number];
// SubscriptionTier is exported from library.ts to avoid duplication
export type SubscriptionTierConfig = typeof subscriptionTierConfig;
