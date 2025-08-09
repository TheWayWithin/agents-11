'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import { formatPrice, type SubscriptionPlan } from '@/lib/stripe/products';
import type { SubscriptionTier } from '@/types';

interface PricingCardProps {
  plan: SubscriptionPlan;
  currentTier?: SubscriptionTier;
  onSelectPlan: (tier: SubscriptionTier) => void;
  loading?: boolean;
}

export function PricingCard({
  plan,
  currentTier,
  onSelectPlan,
  loading = false,
}: PricingCardProps) {
  const isCurrentPlan = currentTier === plan.tier;
  const isUpgrade = currentTier && currentTier !== plan.tier;

  const getButtonText = () => {
    if (isCurrentPlan) {
      return 'Current Plan';
    }
    if (isUpgrade) {
      return 'Upgrade';
    }
    return 'Get Started';
  };

  const getButtonVariant = () => {
    if (isCurrentPlan) {
      return 'outline' as const;
    }
    if (plan.mostPopular) {
      return 'default' as const;
    }
    return 'outline' as const;
  };

  return (
    <Card
      className={`relative ${plan.mostPopular ? 'border-primary shadow-lg' : ''}`}
    >
      {plan.mostPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge
            variant="default"
            className="bg-primary text-primary-foreground"
          >
            Most Popular
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">{formatPrice(plan.price)}</span>
          <span className="text-muted-foreground">/month</span>
        </div>
        <CardDescription className="font-medium text-primary">
          {plan.libraryAccess}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start space-x-3">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={getButtonVariant()}
          className="w-full mt-6"
          disabled={isCurrentPlan || loading}
          onClick={() => onSelectPlan(plan.tier)}
        >
          {loading ? 'Loading...' : getButtonText()}
        </Button>
      </CardContent>
    </Card>
  );
}
