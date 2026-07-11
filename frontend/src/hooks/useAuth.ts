import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { setTokens, clearTokens, setTokenRefreshCallback } from '@/services/api';
import type { LoginRequest, User } from '@/types/auth';
import { useCallback, useEffect } from 'react';

const AUTH_KEY = ['auth', 'me'];

function useAuthStore() {
  const queryClient = useQueryClient();

  useEffect(() => {
    setTokenRefreshCallback(() => {
      queryClient.invalidateQueries({ queryKey: AUTH_KEY });
    });
  }, [queryClient]);

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery<User | null>({
    queryKey: AUTH_KEY,
    queryFn: async () => {
      const storedAccess = localStorage.getItem('accessToken');
      const storedRefresh = localStorage.getItem('refreshToken');
      if (!storedAccess || !storedRefresh) {
        clearTokens();
        return null;
      }
      setTokens(storedAccess, storedRefresh);
      try {
        return await authService.getProfile();
      } catch {
        clearTokens();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        return null;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      queryClient.setQueryData(AUTH_KEY, response.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.setQueryData(AUTH_KEY, null);
      queryClient.clear();
    },
    onError: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      queryClient.setQueryData(AUTH_KEY, null);
      queryClient.clear();
    },
  });

  const login = useCallback(
    (data: LoginRequest) => loginMutation.mutateAsync(data),
    [loginMutation],
  );

  const logout = useCallback(
    () => logoutMutation.mutateAsync(),
    [logoutMutation],
  );

  return {
    user: user ?? null,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    isError,
    error,
    loginError: loginMutation.error,
    isLoggingIn: loginMutation.isPending,
  };
}

export default useAuthStore;
