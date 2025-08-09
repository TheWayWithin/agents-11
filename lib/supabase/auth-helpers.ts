import { createClient } from './server';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { User } from '@supabase/supabase-js';
import type { Profile, Subscription } from '@/types/supabase';

/**
 * Gets the current user from Supabase auth (server-side)
 * Uses React cache to avoid multiple database calls in a single request
 */
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * Gets the current user's profile from the database
 * Uses React cache to avoid multiple database calls in a single request
 */
export const getUserProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;

  const supabase = createClient();
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
});

/**
 * Gets the current user's active subscription
 * Uses React cache to avoid multiple database calls in a single request
 */
export const getUserSubscription = cache(
  async (): Promise<Subscription | null> => {
    const user = await getUser();
    if (!user) return null;

    const supabase = createClient();
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    return subscription;
  }
);

/**
 * Checks if the user is authenticated, redirects to login if not
 */
export async function requireAuth(): Promise<User> {
  const user = await getUser();
  if (!user) {
    redirect('/auth/login');
  }
  return user;
}

/**
 * Checks if the user has the required subscription tier
 */
export async function requireSubscription(
  requiredTier: 'basic' | 'pro' | 'enterprise' = 'basic'
): Promise<{ user: User; subscription: Subscription }> {
  const user = await requireAuth();
  const subscription = await getUserSubscription();

  if (!subscription) {
    redirect('/pricing?error=subscription_required');
  }

  // Check if user's tier is sufficient
  const tierHierarchy = { basic: 1, pro: 2, enterprise: 3 };
  const userTierLevel = tierHierarchy[subscription.tier];
  const requiredTierLevel = tierHierarchy[requiredTier];

  if (userTierLevel < requiredTierLevel) {
    redirect(`/pricing?error=upgrade_required&required=${requiredTier}`);
  }

  return { user, subscription };
}

/**
 * Checks if the user can access a specific library
 */
export async function canAccessLibrary(libraryId: string): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  const supabase = createClient();
  const { data } = await supabase.rpc('user_can_access_library', {
    p_user_id: user.id,
    p_library_id: libraryId,
  });

  return data || false;
}

/**
 * Checks if the user is an admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  const supabase = createClient();
  const { data } = await supabase.rpc('is_admin');

  return data || false;
}

/**
 * Requires admin privileges, redirects if not admin
 */
export async function requireAdmin(): Promise<User> {
  const user = await requireAuth();
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    redirect('/unauthorized');
  }

  return user;
}

/**
 * Gets user's download stats
 */
export async function getUserDownloadStats() {
  const user = await getUser();
  if (!user) return null;

  const supabase = createClient();

  // Get total downloads
  const { count: totalDownloads } = await supabase
    .from('downloads')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get downloads this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: downloadsThisMonth } = await supabase
    .from('downloads')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('downloaded_at', startOfMonth.toISOString());

  // Get recent downloads with library info
  const { data: recentDownloads } = await supabase
    .from('downloads')
    .select(
      `
      *,
      libraries (
        name,
        slug,
        category
      )
    `
    )
    .eq('user_id', user.id)
    .order('downloaded_at', { ascending: false })
    .limit(10);

  return {
    total_downloads: totalDownloads || 0,
    downloads_this_month: downloadsThisMonth || 0,
    recent_downloads: recentDownloads || [],
  };
}

/**
 * Signs out the user and redirects to home
 */
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/');
}
