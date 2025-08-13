import { apiClient } from './client';
import { useAuthStore } from '@/store/auth-store';
import { AuthError, ApiError, createApiError } from '@/lib/errors';

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = {
  email: string;
  password: string;
  full_name: string;
};

export type User = {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
};

type LoginResponse = {
  access_token: string;
  token_type: string;
  user: User;
};

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH_TOKEN: '/auth/refresh-token',
  ME: '/users/me',
} as const;

export const authService = {
  /**
   * Login with email and password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const formData = new FormData();
      formData.append('username', credentials.email);
      formData.append('password', credentials.password);
      
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.LOGIN, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          skipAuthRefresh: true,
        }
      );
      
      const { access_token, user } = response.data;
      
      if (!access_token || !user) {
        throw new AuthError('Invalid response from server');
      }
      
      useAuthStore.getState().login(user, access_token);
      return user;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        throw new AuthError(
          data?.detail || 'Authentication failed',
          status,
          data?.code
        );
      }
      throw createApiError(error);
    }
  },

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<User> {
    try {
      const response = await apiClient.post<LoginResponse>(
        AUTH_ENDPOINTS.REGISTER, 
        data,
        { skipAuthRefresh: true }
      );
      
      const { access_token, user } = response.data;
      
      if (!access_token || !user) {
        throw new AuthError('Invalid response from server');
      }
      
      useAuthStore.getState().login(user, access_token);
      return user;
    } catch (error: any) {
      if (error.response) {
        const { status, data } = error.response;
        throw new AuthError(
          data?.detail || 'Registration failed',
          status,
          data?.code,
          data?.details
        );
      }
      throw createApiError(error);
    }
  },

  /**
   * Logout the current user
   */
  logout(): void {
    useAuthStore.getState().logout();
  },

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await apiClient.get<{ user: User }>(AUTH_ENDPOINTS.ME);
      const user = response.data.user;
      useAuthStore.getState().setUser(user);
      return user;
    } catch (error: any) {
      // If we get a 401, the token is invalid, so we should logout
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
      }
      return null;
    }
  },

  /**
   * Refresh the access token
   */
  async refreshToken(): Promise<string | null> {
    try {
      const response = await apiClient.post<{ access_token: string }>(
        AUTH_ENDPOINTS.REFRESH_TOKEN,
        {},
        { skipAuthRefresh: true }
      );
      
      return response.data.access_token || null;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return null;
    }
  },
};
