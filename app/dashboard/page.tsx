import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SubscriptionStatus, ManageSubscription } from '@/components/pricing';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  Library,
} from 'lucide-react';
import Link from 'next/link';
import { getUserDownloadStats } from '@/lib/supabase/auth-helpers';
import { DownloadButton } from '@/components/ui/download-button';
import { AgentIcon } from '@/components/ui/agent-icon';
import { PatternBackground } from '@/components/ui/pattern-background';

interface DashboardPageProps {
  searchParams: {
    success?: string;
    canceled?: string;
  };
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Get user's profile, subscription, and download stats
  const [{ data: profile }, { data: subscription }, downloadStats] =
    await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single(),
      getUserDownloadStats(),
    ]);

  const showSuccess = searchParams.success === 'true';
  const showCanceled = searchParams.canceled === 'true';

  return (
    <div className="min-h-screen">
      <PatternBackground pattern="waves" opacity={0.08}>
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {profile?.full_name || user.email}
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your subscription and access your AI agent libraries
            </p>
          </div>

          {/* Success/Cancel Messages */}
          {showSuccess && (
            <Card className="mb-6 border-green-200 bg-green-50/90 backdrop-blur-sm">
              <CardContent className="flex items-center space-x-3 pt-6">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">
                    Payment successful!
                  </p>
                  <p className="text-sm text-green-700">
                    Your subscription has been activated and you now have access
                    to your libraries.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {showCanceled && (
            <Card className="mb-6 border-yellow-200 bg-yellow-50/90 backdrop-blur-sm">
              <CardContent className="flex items-center space-x-3 pt-6">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">
                    Payment canceled
                  </p>
                  <p className="text-sm text-yellow-700">
                    No worries! You can subscribe anytime to access premium
                    libraries.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Subscription Status */}
            {subscription ? (
              <SubscriptionStatus subscription={subscription} />
            ) : (
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">
                    No Active Subscription
                  </CardTitle>
                  <CardDescription>
                    Subscribe to access premium AI agent libraries
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    You don&apos;t have an active subscription yet. Subscribe to
                    one of our plans to start downloading AI agent libraries.
                  </p>
                  <a
                    href="/pricing"
                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  >
                    View Pricing Plans
                  </a>
                </CardContent>
              </Card>
            )}

            {/* Manage Subscription */}
            <ManageSubscription hasSubscription={!!subscription} />
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4 mt-8">
            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="flex items-center space-x-4 pt-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Member Since
                  </p>
                  <p className="text-lg font-bold">
                    {profile?.created_at
                      ? new Date(profile.created_at).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="flex items-center space-x-4 pt-6">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Plan Status
                  </p>
                  <p className="text-lg font-bold">
                    {subscription?.status === 'active' ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800"
                      >
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No Plan</Badge>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="flex items-center space-x-4 pt-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Library className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Access Level
                  </p>
                  <p className="text-lg font-bold">
                    {subscription?.tier
                      ? subscription.tier === 'basic'
                        ? 'Starter'
                        : subscription.tier === 'pro'
                          ? 'Professional'
                          : subscription.tier === 'enterprise'
                            ? 'Unlimited'
                            : 'Unknown'
                      : 'None'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-sm">
              <CardContent className="flex items-center space-x-4 pt-6">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Download className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Downloads
                  </p>
                  <p className="text-lg font-bold">
                    {downloadStats?.total_downloads || 0}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Libraries */}
          {subscription && (
            <div className="mt-8">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Library className="h-5 w-5" />
                    Available Libraries
                  </CardTitle>
                  <CardDescription>
                    Based on your{' '}
                    {subscription.tier === 'basic'
                      ? 'Starter'
                      : subscription.tier === 'pro'
                        ? 'Professional'
                        : 'Unlimited'}{' '}
                    subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Agent-11 */}
                    {(subscription.tier === 'pro' ||
                      subscription.tier === 'enterprise') && (
                      <Card className="p-4 hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm">
                        <div className="flex items-start gap-4 mb-3">
                          <AgentIcon
                            agent="coordinator"
                            suite="agent11"
                            size="large"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">Agent-11</h3>
                              <Badge variant="outline">Pro</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Advanced AI agent framework with multi-modal
                              capabilities
                            </p>
                          </div>
                        </div>

                        {/* Agent Preview */}
                        <div className="flex justify-center space-x-2 mb-4">
                          <AgentIcon
                            agent="strategist"
                            suite="agent11"
                            size="small"
                          />
                          <AgentIcon
                            agent="architect"
                            suite="agent11"
                            size="small"
                          />
                          <AgentIcon
                            agent="developer"
                            suite="agent11"
                            size="small"
                          />
                          <AgentIcon
                            agent="designer"
                            suite="agent11"
                            size="small"
                          />
                          <AgentIcon
                            agent="tester"
                            suite="agent11"
                            size="small"
                          />
                          <AgentIcon
                            agent="operator"
                            suite="agent11"
                            size="small"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Link href="/library/agent-11">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                          <DownloadButton
                            size="sm"
                            libraryId="1"
                            libraryName="Agent-11"
                          >
                            Download
                          </DownloadButton>
                        </div>
                      </Card>
                    )}

                    {/* Empire-11 */}
                    {subscription.tier === 'enterprise' && (
                      <Card className="p-4 hover:shadow-md transition-shadow bg-white/90 backdrop-blur-sm">
                        <div className="flex items-start gap-4 mb-3">
                          <AgentIcon
                            agent="sage"
                            suite="empire11"
                            size="large"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">Empire-11</h3>
                              <Badge variant="outline">Enterprise</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Complete automation empire with 11 specialized
                              agents
                            </p>
                          </div>
                        </div>

                        {/* Agent Preview */}
                        <div className="flex justify-center space-x-2 mb-4">
                          <AgentIcon
                            agent="nova"
                            suite="empire11"
                            size="small"
                          />
                          <AgentIcon
                            agent="astra"
                            suite="empire11"
                            size="small"
                          />
                          <AgentIcon
                            agent="phoenix"
                            suite="empire11"
                            size="small"
                          />
                          <AgentIcon
                            agent="rex"
                            suite="empire11"
                            size="small"
                          />
                          <AgentIcon
                            agent="zara"
                            suite="empire11"
                            size="small"
                          />
                          <AgentIcon
                            agent="luna"
                            suite="empire11"
                            size="small"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Link href="/library/empire-11">
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </Link>
                          <DownloadButton
                            size="sm"
                            libraryId="2"
                            libraryName="Empire-11"
                          >
                            Download
                          </DownloadButton>
                        </div>
                      </Card>
                    )}

                    {subscription.tier === 'basic' && (
                      <div className="col-span-2 text-center py-8">
                        <Library className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                          No premium libraries available
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Upgrade to Professional or Unlimited to access our
                          premium AI agent libraries
                        </p>
                        <Link href="/pricing">
                          <Button>Upgrade Plan</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Downloads */}
          {downloadStats && downloadStats.recent_downloads.length > 0 && (
            <div className="mt-8">
              <Card className="bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5" />
                    Recent Downloads
                  </CardTitle>
                  <CardDescription>
                    Your latest downloads this month:{' '}
                    {downloadStats.downloads_this_month}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {downloadStats.recent_downloads.map((download: any) => (
                      <div
                        key={download.id}
                        className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0"
                      >
                        <div>
                          <p className="font-medium">
                            {download.libraries?.name || 'Unknown Library'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(
                              download.downloaded_at
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">
                          {download.libraries?.category || 'Library'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </PatternBackground>
    </div>
  );
}
