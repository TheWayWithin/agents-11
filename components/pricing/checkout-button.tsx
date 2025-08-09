'use client';

import { useState } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import type {
  SubscriptionTier,
  CreateCheckoutSessionRequest,
  CreateCheckoutSessionResponse,
} from '@/types';

interface CheckoutButtonProps extends Omit<ButtonProps, 'onClick'> {
  tier: SubscriptionTier;
  successUrl?: string;
  cancelUrl?: string;
  children?: React.ReactNode;
}

export function CheckoutButton({
  tier,
  successUrl,
  cancelUrl,
  children,
  disabled,
  ...props
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          successUrl:
            successUrl || `${window.location.origin}/dashboard?success=true`,
          cancelUrl:
            cancelUrl || `${window.location.origin}/pricing?canceled=true`,
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
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleCheckout} disabled={disabled || loading} {...props}>
      {loading ? (
        'Loading...'
      ) : (
        <>
          {!children && <CreditCard className="h-4 w-4 mr-2" />}
          {children || 'Subscribe Now'}
        </>
      )}
    </Button>
  );
}
