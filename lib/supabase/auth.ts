import { createClient } from './client';
import type { Provider, AuthError } from '@supabase/supabase-js';

// Authentication return types
export type AuthResult = {
  success: boolean;
  error?: AuthError | null;
  data?: any;
};

export type OAuthProvider = 'google' | 'github' | 'discord' | 'twitter';

/**
 * Sign up with email and password
 */
export async function signUpWithEmail({
  email,
  password,
  userData = {},
}: {
  email: string;
  password: string;
  userData?: {
    full_name?: string;
    username?: string;
  };
}): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.full_name || '',
          username: userData.username || '',
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error as AuthError 
    };
  }
}

/**
 * Sign in with email and password
 */
export async function signInWithEmail({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error as AuthError 
    };
  }
}

/**
 * Sign in with magic link
 */
export async function signInWithMagicLink(email: string): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        shouldCreateUser: true,
      },
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error as AuthError 
    };
  }
}

/**
 * Sign in with OAuth provider
 */
export async function signInWithOAuth(provider: OAuthProvider): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error as AuthError 
    };
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    return { 
      success: false, 
      error: error as AuthError 
    };
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error as AuthError 
    };
  }
}

/**
 * Update password
 */
export async function updatePassword(password: string): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error as AuthError 
    };
  }
}

/**
 * Update user profile
 */
export async function updateProfile({
  full_name,
  username,
  bio,
  avatar_url,
  website,
}: {
  full_name?: string;
  username?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
}): Promise<AuthResult> {
  const supabase = createClient();

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: userError };
    }

    // Update profile in database
    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name,
        username,
        bio,
        avatar_url,
        website,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error as AuthError };
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error as AuthError 
    };
  }
}

/**
 * Become a developer (verify and enable developer features)
 */
export async function becomeDeveloper(): Promise<AuthResult> {
  const supabase = createClient();

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: userError };
    }

    // Update profile to enable developer status
    const { data, error } = await supabase
      .from('profiles')
      .update({
        is_developer: true,
        developer_verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error as AuthError };
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error as AuthError 
    };
  }
}

/**
 * Check if user has verified email
 */
export async function hasVerifiedEmail(): Promise<boolean> {
  const supabase = createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.email_confirmed_at != null;
  } catch {
    return false;
  }
}

/**
 * Resend email verification
 */
export async function resendEmailVerification(): Promise<AuthResult> {
  const supabase = createClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) {
      return { 
        success: false, 
        error: { message: 'No user email found' } as AuthError 
      };
    }

    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email: user.email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    return { 
      success: false, 
      error: error as AuthError 
    };
  }
}

/**
 * Get auth state change listener
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const supabase = createClient();
  
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
}

/**
 * Validate username availability
 */
export async function validateUsername(username: string): Promise<{
  available: boolean;
  error?: string;
}> {
  const supabase = createClient();

  // Basic validation
  if (!username || username.length < 3) {
    return { available: false, error: 'Username must be at least 3 characters' };
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { available: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('username')
      .eq('username', username)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      return { available: false, error: 'Error checking username availability' };
    }

    return { available: !data };
  } catch {
    return { available: false, error: 'Error checking username availability' };
  }
}

/**
 * Create Stripe customer ID for user
 */
export async function createStripeCustomer(): Promise<AuthResult> {
  const supabase = createClient();

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return { success: false, error: userError };
    }

    // Check if customer already exists
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (profile?.stripe_customer_id) {
      return { success: true, data: { customerId: profile.stripe_customer_id } };
    }

    // Create Stripe customer via API
    const response = await fetch('/api/stripe/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        name: profile?.full_name || user.email,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: { message: result.error } as AuthError };
    }

    // Update profile with Stripe customer ID
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        stripe_customer_id: result.customerId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      return { success: false, error: updateError as AuthError };
    }

    return { success: true, data: { customerId: result.customerId } };
  } catch (error) {
    return { 
      success: false, 
      error: error as AuthError 
    };
  }
}