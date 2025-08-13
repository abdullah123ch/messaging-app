import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiClient } from '@/lib/api/client';

export type User = {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superuser: boolean;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  refreshToken: () => Promise<string | null>;
  clearError: () => void;
};

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: (user, token) => {
        set({ user, token, isAuthenticated: true, error: null });
        // Start token refresh timer
        scheduleTokenRefresh();
      },
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          isLoading: false,
          error: null 
        });
        // Clear any scheduled refreshes
        if (window.tokenRefreshTimer) {
          clearTimeout(window.tokenRefreshTimer);
        }
      },
      setUser: (user) => set({ user }),
      refreshToken: async () => {
        const { token } = get();
        if (!token) return null;

        set({ isLoading: true, error: null });
        
        try {
          const response = await apiClient.post('/auth/refresh-token', {}, {
            skipAuthRefresh: true // Prevent infinite loop
          });
          
          const { access_token, user } = response.data;
          if (access_token) {
            set({ 
              token: access_token,
              user: user || get().user,
              isAuthenticated: true,
              isLoading: false 
            });
            scheduleTokenRefresh();
            return access_token;
          }
          return null;
        } catch (error: any) {
          console.error('Token refresh failed:', error);
          set({ 
            error: 'Session expired. Please log in again.',
            isLoading: false 
          });
          get().logout();
          return null;
        }
      },
      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Schedule token refresh before it expires
function scheduleTokenRefresh() {
  if (window.tokenRefreshTimer) {
    clearTimeout(window.tokenRefreshTimer);
  }

  const token = useAuthStore.getState().token;
  if (!token) return;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresIn = (payload.exp * 1000) - Date.now() - TOKEN_REFRESH_THRESHOLD;
    
    if (expiresIn > 0) {
      window.tokenRefreshTimer = setTimeout(() => {
        useAuthStore.getState().refreshToken();
      }, expiresIn);
    }
  } catch (error) {
    console.error('Error scheduling token refresh:', error);
  }
}

declare global {
  interface Window {
    tokenRefreshTimer?: NodeJS.Timeout;
  }
}

// Initialize token refresh on app load
if (typeof window !== 'undefined') {
  const { token, isAuthenticated } = useAuthStore.getState();
  if (isAuthenticated && token) {
    scheduleTokenRefresh();
  }
}
