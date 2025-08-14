import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const error = searchParams.get('error');
  const error_description = searchParams.get('error_description');

  // Handle OAuth/magic link errors
  if (error) {
    console.error('Auth callback error:', error, error_description);
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent(error)}&error_description=${encodeURIComponent(error_description || '')}`
    );
  }

  if (code) {
    const supabase = createClient();
    
    try {
      // Exchange code for session
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError);
        return NextResponse.redirect(
          `${origin}/auth/login?error=auth_exchange_failed&error_description=${encodeURIComponent(exchangeError.message)}`
        );
      }

      // Check if user profile exists
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        // If profile doesn't exist, create it
        if (profileError && profileError.code === 'PGRST116') {
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              email: data.user.email!,
              full_name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email!,
              username: data.user.user_metadata?.preferred_username || data.user.user_metadata?.user_name,
              avatar_url: data.user.user_metadata?.avatar_url || data.user.user_metadata?.picture,
            });

          if (createError) {
            console.error('Profile creation error:', createError);
            // Continue anyway, profile trigger should handle this
          }
        }

        // Log authentication event
        await supabase
          .from('analytics_events')
          .insert({
            event_type: 'user_login',
            user_id: data.user.id,
            metadata: {
              provider: data.user.app_metadata?.provider || 'email',
              method: code ? 'oauth_callback' : 'magic_link',
            },
          });
      }

      // Successful authentication - redirect to next page
      return NextResponse.redirect(`${origin}${next}`);
      
    } catch (error) {
      console.error('Auth callback unexpected error:', error);
      return NextResponse.redirect(
        `${origin}/auth/login?error=unexpected_error&error_description=An unexpected error occurred during authentication`
      );
    }
  }

  // No code provided - redirect to login
  return NextResponse.redirect(`${origin}/auth/login?error=no_code&error_description=No authentication code provided`);
}