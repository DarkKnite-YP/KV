import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import type { Profile } from '../types';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isAdmin: boolean;

  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  profile: null,
  isLoading: true,
  isAdmin: false,

  setUser: (user) =>
    set((state) => ({
      user,
      isAdmin: state.profile?.role === 'admin' || user?.email?.toLowerCase() === 'yashjpatel369@gmail.com',
    })),
  setSession: (session) => set({ session }),
  setProfile: (profile) =>
    set((state) => ({
      profile,
      isAdmin:
        profile?.role === 'admin' ||
        state.user?.email?.toLowerCase() === 'yashjpatel369@gmail.com' ||
        profile?.email?.toLowerCase() === 'yashjpatel369@gmail.com',
    })),
  setLoading: (isLoading) => set({ isLoading }),
  reset: () =>
    set({
      user: null,
      session: null,
      profile: null,
      isLoading: false,
      isAdmin: false,
    }),
}));

