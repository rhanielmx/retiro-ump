'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useAuth as useTanStackAuth } from '@/hooks/api/useAuth';
import { AuthUser } from '@/types/api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
  isLoading: boolean;
  isLoggingIn: boolean;
  isLoggingOut: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useTanStackAuth();

  // Convert the new hook interface to match the old interface for backward compatibility
  const value: AuthContextType = {
    user: auth.user || null,
    isAuthenticated: auth.isAuthenticated,
    login: async (username: string, password: string) => {
      try {
        await auth.login({ username, password });
        return true;
      } catch {
        return false;
      }
    },
    logout: async () => {
      await auth.logout();
    },
    checkAuth: async () => {
      return auth.isAuthenticated;
    },
    isLoading: auth.isLoading,
    isLoggingIn: auth.isLoggingIn,
    isLoggingOut: auth.isLoggingOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};