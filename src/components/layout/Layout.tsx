import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from './ScrollToTop';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { useCartStore } from '../../stores/cartStore';
import { useOrchardStore } from '../../stores/orchardStore';
import { syncFromSupabase, isRealSupabaseConfigured } from '../../lib/supabaseService';

export function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const { setUser, setSession, setProfile } = useAuthStore();

  useEffect(() => {
    // 1. Initial Data Sync from Supabase if configured
    if (isRealSupabaseConfigured()) {
      syncFromSupabase();
    }

    // Auto-sync when window re-gains focus or visibility
    const handleReFocus = () => {
      if (document.visibilityState === 'visible' && isRealSupabaseConfigured()) {
        syncFromSupabase();
      }
    };
    window.addEventListener('visibilitychange', handleReFocus);
    window.addEventListener('focus', handleReFocus);

    // 2. Auth State Listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          // Fetch or construct profile
          setProfile({
            id: session.user.id,
            first_name: session.user.user_metadata?.first_name || null,
            last_name: session.user.user_metadata?.last_name || null,
            email: session.user.email || null,
            phone: session.user.user_metadata?.phone || null,
            avatar_url: null,
            role: session.user.email?.includes('admin') ? 'admin' : 'customer',
            created_at: session.user.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } else {
          setProfile(null);
          // Complete client-end wipe when logged out
          useCartStore.getState().clearCart();
          useOrchardStore.setState({ orders: [], visits: [] });
          try {
            localStorage.removeItem('cart-storage');
          } catch (e) {}
        }
      }
    );

    return () => {
      window.removeEventListener('visibilitychange', handleReFocus);
      window.removeEventListener('focus', handleReFocus);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-mango-cream">
      <ScrollToTop />
      {!isAdmin && <Header />}
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
    </div>
  );
}
