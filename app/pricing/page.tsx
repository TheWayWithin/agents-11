import { Suspense } from 'react';
import { PricingTable } from '@/components/pricing';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function PricingPage() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user's current subscription if they're logged in
  let currentTier = undefined;
  if (user) {
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('tier')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    currentTier = subscription?.tier;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get access to premium AI agent libraries with our flexible
            subscription plans. Download, customize, and deploy powerful AI
            agents for your projects.
          </p>
        </div>

        {/* Pricing Table */}
        <Suspense fallback={<PricingTableSkeleton />}>
          <PricingTable currentTier={currentTier} />
        </Suspense>

        {/* FAQ Section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                What&apos;s included in each plan?
              </h3>
              <p className="text-gray-600">
                Each plan gives you access to different numbers of AI agent
                libraries. Starter includes 1 library, Professional includes 3
                libraries, and Unlimited gives you access to all libraries in
                our marketplace.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Can I upgrade or downgrade anytime?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade or downgrade your plan at any time through
                our billing portal. Changes take effect immediately for upgrades
                and at the end of your billing cycle for downgrades.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                What happens if I cancel my subscription?
              </h3>
              <p className="text-gray-600">
                You&apos;ll continue to have access to your downloaded libraries
                until the end of your current billing period. After
                cancellation, you won&apos;t be able to download new libraries
                or access premium features.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee for first-time
                subscribers. Contact our support team if you&apos;re not
                satisfied with your purchase.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Need help choosing a plan? We&apos;re here to help.
          </p>
          <p className="text-sm text-gray-500">
            Contact us at{' '}
            <a
              href="mailto:support@agents-11.com"
              className="text-blue-600 hover:underline"
            >
              support@agents-11.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

function PricingTableSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {[1, 2, 3].map(i => (
        <div key={i} className="border rounded-lg p-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-3 mb-6">
            {[1, 2, 3, 4].map(j => (
              <div key={j} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
    </div>
  );
}
