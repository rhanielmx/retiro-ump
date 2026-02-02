'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AuthUser, LoginCredentials, queryKeys } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

// Helper functions for auth operations
const login = async (credentials: LoginCredentials): Promise<AuthUser> => {
  const response = await fetch('/api/admin/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    let errorMessage = 'Falha no login';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch {
      errorMessage = `Erro ${response.status}: ${response.statusText || errorMessage}`;
    }
    throw new Error(errorMessage);
  }

  // Create token and store in localStorage
  const token = btoa(`${credentials.username}:${credentials.password}`);
  localStorage.setItem('admin_token', token);
  
  const user: AuthUser = {
    username: credentials.username,
    role: 'ADMIN',
  };
  
  localStorage.setItem('admin_user', JSON.stringify(user));
  return user;
};

const logout = async (): Promise<void> => {
  // Clear localStorage
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
};

const checkAuth = async (): Promise<AuthUser | null> => {
  const token = localStorage.getItem('admin_token');
  const userData = localStorage.getItem('admin_user');
  
  if (!token || !userData) {
    return null;
  }

  try {
    // Verify the token is still valid by making a test request
    const response = await fetch('/api/admin/auth', {
      method: 'GET',
      headers: {
        'Authorization': 'Basic ' + token
      }
    });

    if (response.ok) {
      const user = JSON.parse(userData);
      return user;
    } else {
      // Token is invalid, clear it
      await logout();
      return null;
    }
  } catch (error) {
    // Error verifying token, clear it
    await logout();
    return null;
  }
};

// Query hooks
export const useAuth = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.auth,
    queryFn: checkAuth,
    staleTime: 0, // Always check auth state on mount
    refetchOnWindowFocus: true,
    retry: false, // Don't retry auth failures automatically
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      queryClient.setQueryData(queryKeys.auth, user);
      toast({
        title: "Login realizado com sucesso",
        description: `Bem-vindo, ${user.username}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro no login",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth, null);
      queryClient.clear(); // Clear all queries on logout
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    },
    onError: () => {
      // Even if logout fails, clear local state
      queryClient.setQueryData(queryKeys.auth, null);
      queryClient.clear();
    },
  });

  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
};