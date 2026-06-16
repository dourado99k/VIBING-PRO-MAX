import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/login', { email, password });
          localStorage.setItem('skillforge_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          return data;
        } catch (e) {
          set({ isLoading: false });
          throw e;
        }
      },

      register: async (payload) => {
        set({ isLoading: true });
        try {
          const { data } = await api.post('/auth/register', payload);
          localStorage.setItem('skillforge_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          return data;
        } catch (e) {
          set({ isLoading: false });
          throw e;
        }
      },

      fetchMe: async () => {
        const token = get().token || localStorage.getItem('skillforge_token');
        if (!token) return;
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user, token });
        } catch {
          get().logout();
        }
      },

      setUser: (user) => set({ user }),

      logout: () => {
        localStorage.removeItem('skillforge_token');
        set({ user: null, token: null });
      },

      isAuthenticated: () => !!get().token || !!localStorage.getItem('skillforge_token'),
      isOrgAdmin: () => {
        const r = get().user?.role;
        return r === 'ORG_ADMIN' || r === 'SUPER_ADMIN';
      },
      isLearner: () => get().user?.role === 'USER',
      isPremium: () => get().user?.plan === 'PREMIUM',
      organization: () => get().user?.organization,
    }),
    {
      name: 'skillforge-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
);
