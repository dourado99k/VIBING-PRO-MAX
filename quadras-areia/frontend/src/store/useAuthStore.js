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
          localStorage.setItem('quadras_token', data.token);
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
          localStorage.setItem('quadras_token', data.token);
          set({ user: data.user, token: data.token, isLoading: false });
          return data;
        } catch (e) {
          set({ isLoading: false });
          throw e;
        }
      },

      checkAuth: async () => {
        const token = get().token || localStorage.getItem('quadras_token');
        if (!token) return;
        try {
          const { data } = await api.get('/auth/me');
          set({ user: data.user, token });
        } catch {
          get().logout();
        }
      },

      logout: () => {
        localStorage.removeItem('quadras_token');
        set({ user: null, token: null });
      },

      isAuthenticated: () => !!get().token || !!localStorage.getItem('quadras_token'),
      isAdmin: () => get().user?.role === 'ADMIN',
      isCliente: () => get().user?.role === 'CLIENTE',
    }),
    {
      name: 'quadras-auth',
      partialize: (s) => ({ token: s.token, user: s.user }),
    }
  )
);
