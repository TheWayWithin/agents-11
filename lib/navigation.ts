'use client';

import { useRouter } from 'next/navigation';

// Navigation helper functions
export const navigateToPackages = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/packages';
  }
};

export const navigateToEmailGate = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/email-gate';
  }
};

export const navigateToMarketplace = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/marketplace';
  }
};

// Hook for programmatic navigation in components
export const useAppNavigation = () => {
  const router = useRouter();
  
  return {
    toPackages: () => router.push('/packages'),
    toEmailGate: () => router.push('/email-gate'),
    toMarketplace: () => router.push('/marketplace'),
    toHome: () => router.push('/'),
    toPricing: () => router.push('/pricing'),
    toDashboard: () => router.push('/dashboard')
  };
};

// Route constants
export const ROUTES = {
  HOME: '/',
  PACKAGES: '/packages',
  EMAIL_GATE: '/email-gate',
  MARKETPLACE: '/marketplace',
  PRICING: '/pricing',
  DASHBOARD: '/dashboard',
  LOGIN: '/login',
  SIGNUP: '/signup'
} as const;

// Helper to determine if user needs authentication for a route
export const requiresAuth = (pathname: string): boolean => {
  const authRequiredRoutes = [
    ROUTES.MARKETPLACE,
    ROUTES.DASHBOARD
  ];
  
  return authRequiredRoutes.includes(pathname as any);
};

// Helper to get redirect path based on user state
export const getRedirectPath = (userTier: string | null, intendedPath: string) => {
  // If trying to access marketplace without auth, redirect to email gate
  if (intendedPath === ROUTES.MARKETPLACE && !userTier) {
    return ROUTES.EMAIL_GATE;
  }
  
  // Default behavior
  return intendedPath;
};