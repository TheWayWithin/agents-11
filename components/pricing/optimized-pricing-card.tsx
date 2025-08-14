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
import { Check, X, AlertTriangle } from 'lucide-react';
import { formatPrice, type SubscriptionPlan } from '@/lib/stripe/products';
import type { SubscriptionTier } from '@/types';

interface OptimizedPricingCardProps {
  plan: SubscriptionPlan;
  currentTier?: SubscriptionTier;
  onSelectPlan: (tier: SubscriptionTier) => void;
  loading?: boolean;
  showComparison?: boolean;
}

export function OptimizedPricingCard({
  plan,
  currentTier,
  onSelectPlan,
  loading = false,
  showComparison = true,
}: OptimizedPricingCardProps) {
  const isCurrentPlan = currentTier === plan.tier;
  const isUpgrade = currentTier && currentTier !== plan.tier;

  const getButtonText = () => {
    if (isCurrentPlan) {
      return 'Current Plan';
    }
    if (plan.ctaText) {
      return plan.ctaText;
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
    return (plan.ctaVariant || 'outline') as const;
  };

  const getRiskLevelColor = () => {
    switch (plan.riskLevel) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getRiskIcon = () => {
    switch (plan.riskLevel) {
      case 'high':
        return <X className="h-4 w-4 text-red-500" />;
      case 'medium':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'low':
        return <Check className="h-4 w-4 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className={`relative transition-all duration-300 hover:shadow-lg ${
        plan.bestValue
          ? 'border-primary shadow-lg scale-105 ring-2 ring-primary/20'
          : plan.mostPopular
          ? 'border-primary shadow-md'
          : ''
      }`}
    >
      {/* Badges */}
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 flex flex-col gap-1">
        {plan.bestValue && (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold">
            BEST VALUE ⭐
          </Badge>
        )}
        {plan.mostPopular && !plan.bestValue && (
          <Badge variant="default" className="bg-primary text-primary-foreground">
            Most Popular
          </Badge>
        )}
      </div>

      <CardHeader className="text-center pb-4 pt-6">
        {/* Plan Name with Risk Indicator */}
        <div className="flex items-center justify-center gap-2 mb-2">
          {getRiskIcon()}
          <CardTitle className="text-xl font-bold">{plan.name}</CardTitle>
        </div>

        {/* Conversion Message */}
        {plan.conversionMessage && (
          <div className={`text-xs px-3 py-1 rounded-full border ${getRiskLevelColor()}`}>
            {plan.conversionMessage}
          </div>
        )}

        {/* Price */}
        <div className="mt-4">
          <span className="text-4xl font-bold">{formatPrice(plan.price)}</span>
          <span className="text-muted-foreground">/month</span>
        </div>

        {/* Value per Agent */}
        {plan.valuePerAgent && showComparison && (
          <div className="text-sm text-muted-foreground">
            {plan.valuePerAgent} per agent
          </div>
        )}

        {/* Library Access */}
        <CardDescription className="font-medium text-primary mt-2">
          {plan.libraryAccess}
        </CardDescription>

        {/* Selection Rate */}
        {plan.selectRate && (
          <div className="text-xs text-muted-foreground mt-1">
            {plan.selectRate} of users choose this
          </div>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm text-green-700">What's Included:</h4>
          <ul className="space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-3">
                <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Limitations */}
        {plan.limitations && plan.limitations.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-red-700">Limitations:</h4>
            <ul className="space-y-2">
              {plan.limitations.map((limitation, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <X className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-600">{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upgrade Rate for non-unlimited plans */}
        {plan.upgradeRate && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="text-xs text-yellow-700 font-medium">
              ⚠️ {plan.upgradeRate}
            </div>
          </div>
        )}

        {/* Social Proof */}
        {plan.socialProof && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-xs text-green-700 font-medium">
              ✨ {plan.socialProof}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Button
          variant={getButtonVariant()}
          size="lg"
          className={`w-full mt-6 font-bold ${
            plan.bestValue
              ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-none'
              : ''
          }`}
          disabled={isCurrentPlan || loading}
          onClick={() => onSelectPlan(plan.tier)}
        >
          {loading ? 'Loading...' : getButtonText()}
        </Button>

        {/* Additional CTA messaging for high-value plan */}
        {plan.bestValue && (
          <div className="text-center text-xs text-muted-foreground mt-2">
            Join 2,847 successful entrepreneurs
          </div>
        )}
      </CardContent>
    </Card>
  );
}