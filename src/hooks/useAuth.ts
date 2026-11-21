import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useOrchardStore } from '../stores/orchardStore';
import type { Profile } from '../types';

export function useAuth() {
  const {
    user,
    session,
    profile,
    isLoading,
    isAdmin,
    setUser,
    setSession,
    setProfile,
    setLoading,
    reset,
  } = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        wipeUserDataOnLogout();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  function wipeUserDataOnLogout() {
    reset();
    useCartStore.getState().clearCart();
    useOrchardStore.setState({ orders: [], visits: [] });
    try {
      localStorage.removeItem('cart-storage');
      sessionStorage.clear();
    } catch (e) {
      // ignore storage access issues
    }
  }

  async function fetchProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data as Profile);
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
    wipeUserDataOnLogout();
  }

  return {
    user,
    session,
    profile,
    isLoading,
    isAdmin,
    signOut,
  };
}

