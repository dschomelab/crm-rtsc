import { apiClient, setTokens, clearTokens } from './api';
import type { LoginRequest, LoginResponse, User } from '@/types/auth';

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      clearTokens();
    }
  },

  async refresh(refreshTokenValue: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/refresh', {
      refreshToken: refreshTokenValue,
    });
    setTokens(response.accessToken, response.refreshToken);
    return response;
  },

  async getProfile(): Promise<User> {
    return apiClient.get<User>('/auth/me');
  },
};
