'use client';

import { useState } from 'react';
import { PricingCard } from './pricing-card';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe/products';
import type {
  SubscriptionTier,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from '@/types';

interface PricingTableProps {
  currentTier?: SubscriptionTier;
  onPlanSelect?: (tier: SubscriptionTier) => void;
}

export function PricingTable({ currentTier, onPlanSelect }: PricingTableProps) {
  const [loading, setLoading] = useState<SubscriptionTier | null>(null);

  const handlePlanSelect = async (tier: SubscriptionTier) => {
    if (onPlanSelect) {
      onPlanSelect(tier);
      return;
    }

    // Default behavior: redirect to checkout
    setLoading(tier);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        } as CreateCheckoutSessionRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url }: CreateCheckoutSessionResponse = await response.json();

      if (url) {
        window.location.href = url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Checkout failed:', error);
      alert('Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {SUBSCRIPTION_PLANS.map(plan => (
        <PricingCard
          key={plan.tier}
          plan={plan}
          currentTier={currentTier}
          onSelectPlan={handlePlanSelect}
          loading={loading === plan.tier}
        />
      ))}
    </div>
  );
}
