'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  TIER_DISPLAY_MAP,
  formatPrice,
  getPlanByTier,
} from '@/lib/stripe/products';
import type { UserSubscription } from '@/types';

interface SubscriptionStatusProps {
  subscription: UserSubscription;
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  const plan = getPlanByTier(subscription.tier);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'trialing':
        return 'bg-blue-100 text-blue-800';
      case 'past_due':
      case 'unpaid':
        return 'bg-red-100 text-red-800';
      case 'canceled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'trialing':
        return 'Trial';
      case 'past_due':
        return 'Past Due';
      case 'unpaid':
        return 'Unpaid';
      case 'canceled':
        return 'Canceled';
      case 'incomplete':
        return 'Incomplete';
      case 'incomplete_expired':
        return 'Expired';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Current Subscription</CardTitle>
          <Badge className={getStatusColor(subscription.status)}>
            {getStatusText(subscription.status)}
          </Badge>
        </div>
        <CardDescription>
          Your subscription details and billing information
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Plan</p>
            <p className="text-lg font-semibold">
              {TIER_DISPLAY_MAP[subscription.tier]}
            </p>
            {plan && (
              <p className="text-sm text-muted-foreground">
                {formatPrice(plan.price)}/month
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Access Level
            </p>
            <p className="text-sm">
              {plan?.libraryAccess || 'Unknown access level'}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Current Period
            </p>
            <p className="text-sm">
              {formatDate(subscription.current_period_start)} -{' '}
              {formatDate(subscription.current_period_end)}
            </p>
          </div>

          {subscription.cancel_at_period_end && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Cancellation
              </p>
              <p className="text-sm text-orange-600">
                Cancels on {formatDate(subscription.current_period_end)}
              </p>
            </div>
          )}
        </div>

        {subscription.status === 'past_due' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              Your subscription payment is past due. Please update your payment
              method to continue accessing libraries.
            </p>
          </div>
        )}

        {subscription.status === 'trialing' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800">
              You&apos;re currently in your free trial period. Your subscription
              will begin on {formatDate(subscription.current_period_end)}.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
