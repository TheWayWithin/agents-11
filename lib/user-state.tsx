'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// User tier types
export type UserTier = 'unlimited' | 'package' | 'browse' | null;

// User journey path types
export type UserJourneyPath = 'unlimited' | 'package' | 'browse' | null;

// User state interface
export interface UserState {
  tier: UserTier;
  journeyPath: UserJourneyPath;
  isAuthenticated: boolean;
  email?: string;
}

// Context interface
interface UserStateContextType {
  userState: UserState;
  setUserTier: (tier: UserTier) => void;
  setJourneyPath: (path: UserJourneyPath) => void;
  setAuthenticated: (auth: boolean, email?: string) => void;
  resetUserState: () => void;
}

// Default user state
const defaultUserState: UserState = {
  tier: null,
  journeyPath: null,
  isAuthenticated: false
};

// Create context
const UserStateContext = createContext<UserStateContextType | undefined>(undefined);

// Local storage keys
const STORAGE_KEYS = {
  USER_TIER: 'agents11_user_tier',
  JOURNEY_PATH: 'agents11_journey_path',
  IS_AUTHENTICATED: 'agents11_is_authenticated',
  USER_EMAIL: 'agents11_user_email'
} as const;

// Provider component
export function UserStateProvider({ children }: { children: ReactNode }) {
  const [userState, setUserState] = useState<UserState>(defaultUserState);

  // Load state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTier = localStorage.getItem(STORAGE_KEYS.USER_TIER) as UserTier;
      const storedPath = localStorage.getItem(STORAGE_KEYS.JOURNEY_PATH) as UserJourneyPath;
      const storedAuth = localStorage.getItem(STORAGE_KEYS.IS_AUTHENTICATED) === 'true';
      const storedEmail = localStorage.getItem(STORAGE_KEYS.USER_EMAIL);

      setUserState({
        tier: storedTier,
        journeyPath: storedPath,
        isAuthenticated: storedAuth,
        email: storedEmail || undefined
      });
    }
  }, []);

  // Update user tier
  const setUserTier = (tier: UserTier) => {
    setUserState(prev => ({ ...prev, tier }));
    if (typeof window !== 'undefined') {
      if (tier) {
        localStorage.setItem(STORAGE_KEYS.USER_TIER, tier);
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER_TIER);
      }
    }
  };

  // Update journey path
  const setJourneyPath = (path: UserJourneyPath) => {
    setUserState(prev => ({ ...prev, journeyPath: path }));
    if (typeof window !== 'undefined') {
      if (path) {
        localStorage.setItem(STORAGE_KEYS.JOURNEY_PATH, path);
      } else {
        localStorage.removeItem(STORAGE_KEYS.JOURNEY_PATH);
      }
    }
  };

  // Update authentication status
  const setAuthenticated = (auth: boolean, email?: string) => {
    setUserState(prev => ({ ...prev, isAuthenticated: auth, email }));
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.IS_AUTHENTICATED, auth.toString());
      if (email) {
        localStorage.setItem(STORAGE_KEYS.USER_EMAIL, email);
      } else {
        localStorage.removeItem(STORAGE_KEYS.USER_EMAIL);
      }
    }
  };

  // Reset all user state
  const resetUserState = () => {
    setUserState(defaultUserState);
    if (typeof window !== 'undefined') {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  };

  const contextValue: UserStateContextType = {
    userState,
    setUserTier,
    setJourneyPath,
    setAuthenticated,
    resetUserState
  };

  return (
    <UserStateContext.Provider value={contextValue}>
      {children}
    </UserStateContext.Provider>
  );
}

// Custom hook to use user state
export function useUserState() {
  const context = useContext(UserStateContext);
  
  if (context === undefined) {
    throw new Error('useUserState must be used within a UserStateProvider');
  }
  
  return context;
}

// Helper functions for common checks
export const isUserAuthenticated = (userState: UserState): boolean => {
  return userState.isAuthenticated;
};

export const canAccessMarketplace = (userState: UserState): boolean => {
  return userState.isAuthenticated;
};

export const canAccessPremiumFeatures = (userState: UserState): boolean => {
  return userState.tier === 'unlimited' || userState.tier === 'package';
};

export const getUserDisplayName = (userState: UserState): string => {
  if (userState.email) {
    return userState.email;
  }
  
  switch (userState.tier) {
    case 'unlimited':
      return 'Unlimited User';
    case 'package':
      return 'Package User';
    case 'browse':
      return 'Browser';
    default:
      return 'Guest';
  }
};