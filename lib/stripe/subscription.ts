import { stripe } from './stripe';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import type { SubscriptionTier, SubscriptionStatus } from '@/types';
import { getPlanByPriceId } from './products';

export interface SubscriptionData {
  subscriptionId: string;
  customerId: string;
  status: SubscriptionStatus;
  tier: SubscriptionTier;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
}

/**
 * Create or update subscription in database
 */
export async function upsertSubscription(
  userId: string,
  subscriptionData: SubscriptionData
): Promise<void> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase.from('subscriptions').upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscriptionData.subscriptionId,
      stripe_customer_id: subscriptionData.customerId,
      tier: subscriptionData.tier,
      status: subscriptionData.status,
      current_period_start: subscriptionData.currentPeriodStart.toISOString(),
      current_period_end: subscriptionData.currentPeriodEnd.toISOString(),
      cancel_at_period_end: subscriptionData.cancelAtPeriodEnd,
      updated_at: new Date().toISOString(),
    },
    {
      onConflict: 'stripe_subscription_id',
    }
  );

  if (error) {
    console.error('Failed to upsert subscription:', error);
    throw new Error('Failed to update subscription in database');
  }
}

/**
 * Cancel subscription in database (mark as canceled)
 */
export async function cancelSubscriptionInDB(
  subscriptionId: string
): Promise<void> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Failed to cancel subscription:', error);
    throw new Error('Failed to cancel subscription in database');
  }
}

/**
 * Get user subscription from database
 */
export async function getUserSubscription(userId: string) {
  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (error) {
    console.error('Failed to get user subscription:', error);
    return null;
  }

  return data;
}

/**
 * Parse Stripe subscription object to our format
 */
export function parseStripeSubscription(
  subscription: any // Stripe.Subscription
): SubscriptionData {
  // Get tier from the subscription price
  const priceId = subscription.items.data[0]?.price?.id;
  const plan = getPlanByPriceId(priceId);

  if (!plan) {
    throw new Error(`Unknown price ID: ${priceId}`);
  }

  // Map Stripe status to our status enum
  const mapStripeStatus = (stripeStatus: string): SubscriptionStatus => {
    switch (stripeStatus) {
      case 'active':
        return 'active';
      case 'canceled':
        return 'canceled';
      case 'past_due':
        return 'past_due';
      case 'unpaid':
        return 'unpaid';
      case 'incomplete':
        return 'incomplete';
      case 'incomplete_expired':
        return 'incomplete_expired';
      case 'trialing':
        return 'trialing';
      default:
        console.warn(
          `Unknown Stripe status: ${stripeStatus}, defaulting to 'incomplete'`
        );
        return 'incomplete';
    }
  };

  return {
    subscriptionId: subscription.id,
    customerId: subscription.customer as string,
    status: mapStripeStatus(subscription.status),
    tier: plan.tier,
    currentPeriodStart: new Date(subscription.current_period_start * 1000),
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    cancelAtPeriodEnd: subscription.cancel_at_period_end || false,
  };
}

/**
 * Create Stripe customer for user
 */
export async function createStripeCustomer(
  userId: string,
  email: string,
  name?: string
) {
  try {
    const customer = await stripe.customers.create({
      email,
      name: name || undefined,
      metadata: {
        userId,
      },
    });

    return customer;
  } catch (error) {
    console.error('Failed to create Stripe customer:', error);
    throw error;
  }
}

/**
 * Get or create Stripe customer
 */
export async function getOrCreateCustomer(
  userId: string,
  email: string,
  name?: string
) {
  // First check if user already has a subscription with customer ID
  const existingSubscription = await getUserSubscription(userId);
  if (existingSubscription?.stripe_customer_id) {
    try {
      const customer = await stripe.customers.retrieve(
        existingSubscription.stripe_customer_id
      );
      if (!customer.deleted) {
        return customer;
      }
    } catch (error) {
      console.warn('Existing customer not found, creating new one:', error);
    }
  }

  // Search for existing customer by email
  const existingCustomers = await stripe.customers.list({
    email,
    limit: 1,
  });

  if (existingCustomers.data.length > 0) {
    const customer = existingCustomers.data[0];
    // Update metadata with userId if missing
    if (!customer.metadata.userId) {
      await stripe.customers.update(customer.id, {
        metadata: { userId },
      });
    }
    return customer;
  }

  // Create new customer
  return await createStripeCustomer(userId, email, name);
}

/**
 * Check if user has access to a library based on their subscription
 */
export async function checkLibraryAccess(
  userId: string,
  libraryTier: SubscriptionTier
): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  if (!subscription) {
    return false;
  }

  // Define tier hierarchy
  const tierHierarchy: Record<SubscriptionTier, number> = {
    basic: 1,
    pro: 2,
    enterprise: 3,
  };

  const userTierLevel = tierHierarchy[subscription.tier];
  const requiredTierLevel = tierHierarchy[libraryTier];

  return userTierLevel >= requiredTierLevel;
}
