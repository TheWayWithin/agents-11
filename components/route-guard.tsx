'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  fallback?: ReactNode;
}

export function RouteGuard({ 
  children, 
  requireAuth = false, 
  redirectTo = '/email-gate',
  fallback 
}: RouteGuardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Simple check for now - in a real implementation this would check Supabase auth
    // For now, we'll check localStorage for our user state
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        const authStatus = localStorage.getItem('agents11_is_authenticated') === 'true';
        setIsAuthenticated(authStatus);
        setIsLoading(false);

        // If auth is required but user is not authenticated, redirect
        if (requireAuth && !authStatus) {
          router.push(redirectTo);
        }
      }
    };

    checkAuth();
  }, [requireAuth, redirectTo, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but user is not authenticated, show fallback
  if (requireAuth && !isAuthenticated) {
    return fallback || (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Authentication Required
              </h2>
              
              <p className="text-gray-600 mb-6">
                You need to create an account to access this page.
              </p>
              
              <div className="space-y-4">
                <Link 
                  href="/email-gate"
                  className="inline-block w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create Account
                </Link>
                
                <Link 
                  href="/"
                  className="inline-block text-blue-600 hover:text-blue-800 underline"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render children if authenticated or auth not required
  return <>{children}</>;
}