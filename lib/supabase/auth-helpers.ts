import { createClient } from './server';
import { createClient as createBrowserClient } from './client';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import type { User, AuthError, Provider } from '@supabase/supabase-js';
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
  requiredTier: 'single' | 'library' | 'unlimited' = 'single'
): Promise<{ user: User; subscription: Subscription }> {
  const user = await requireAuth();
  const subscription = await getUserSubscription();

  if (!subscription) {
    redirect('/pricing?error=subscription_required');
  }

  // Check if user's tier is sufficient
  const tierHierarchy = { single: 1, library: 2, unlimited: 3 };
  const userTierLevel = tierHierarchy[subscription.tier];
  const requiredTierLevel = tierHierarchy[requiredTier];

  if (userTierLevel < requiredTierLevel) {
    redirect(`/pricing?error=upgrade_required&required=${requiredTier}`);
  }

  return { user, subscription };
}

/**
 * Checks if the user can access a specific agent
 */
export async function canAccessAgent(agentId: string): Promise<boolean> {
  const user = await getUser();
  if (!user) return false;

  const supabase = createClient();
  
  // Check if agent is free
  const { data: agent } = await supabase
    .from('agents')
    .select('pricing_model')
    .eq('id', agentId)
    .eq('status', 'published')
    .single();
    
  if (agent?.pricing_model === 'free') return true;
  
  // Check user access
  const { data: access } = await supabase
    .from('user_agent_access')
    .select('*')
    .eq('user_id', user.id)
    .eq('agent_id', agentId)
    .single();
    
  if (!access) return false;
  
  // Check if access is still valid
  if (access.expires_at && new Date(access.expires_at) < new Date()) {
    return false;
  }
  
  return true;
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
 * Gets user's installation stats
 */
export async function getUserInstallationStats() {
  const user = await getUser();
  if (!user) return null;

  const supabase = createClient();

  // Get total installations
  const { count: totalInstallations } = await supabase
    .from('agent_installations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  // Get installations this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count: installationsThisMonth } = await supabase
    .from('agent_installations')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .gte('installed_at', startOfMonth.toISOString());

  // Get recent installations with agent info
  const { data: recentInstallations } = await supabase
    .from('agent_installations')
    .select(
      `
      *,
      agents (
        name,
        slug,
        icon_url,
        developer:profiles!agents_developer_id_fkey (
          full_name,
          username
        )
      )
    `
    )
    .eq('user_id', user.id)
    .order('installed_at', { ascending: false })
    .limit(10);

  return {
    total_installations: totalInstallations || 0,
    installations_this_month: installationsThisMonth || 0,
    recent_installations: recentInstallations || [],
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
