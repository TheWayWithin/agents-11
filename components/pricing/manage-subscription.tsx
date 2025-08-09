'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ExternalLink, Settings } from 'lucide-react';
import type {
  CreatePortalSessionRequest,
  CreatePortalSessionResponse,
} from '@/types';

interface ManageSubscriptionProps {
  hasSubscription: boolean;
  className?: string;
}

export function ManageSubscription({
  hasSubscription,
  className,
}: ManageSubscriptionProps) {
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    setLoading(true);

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnUrl: window.location.href,
        } as CreatePortalSessionRequest),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create portal session');
      }

      const { url }: CreatePortalSessionResponse = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Portal access failed:', error);
      alert('Failed to access billing portal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!hasSubscription) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Settings className="h-5 w-5" />
          <CardTitle className="text-lg">Manage Subscription</CardTitle>
        </div>
        <CardDescription>
          Update billing information, change plans, or cancel your subscription
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          onClick={handleManageSubscription}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {loading ? (
            'Opening...'
          ) : (
            <>
              <ExternalLink className="h-4 w-4 mr-2" />
              Billing Portal
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground mt-3">
          You&apos;ll be redirected to Stripe&apos;s secure billing portal where
          you can manage your subscription, update payment methods, view
          invoices, and more.
        </p>
      </CardContent>
    </Card>
  );
}
