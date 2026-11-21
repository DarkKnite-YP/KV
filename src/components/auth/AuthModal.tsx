import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../stores/authStore';
import { Button, Input } from '../ui';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
  onSuccess?: () => void;
}

export function AuthModal({
  isOpen,
  onClose,
  defaultMode = 'login',
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  const { setUser, setSession, setProfile } = useAuthStore();

  if (!isOpen) return null;

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage('');
    setInfoMessage('');
    setIsLoading(true);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const isRealSupabase = supabaseUrl && !supabaseUrl.includes('placeholder');

    if (isRealSupabase) {
      try {
        if (mode === 'signup') {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                first_name: firstName,
                phone,
              },
            },
          });
          if (error) throw error;
          if (data.session) {
            setSession(data.session);
            setUser(data.user);
            setProfile({
              id: data.user!.id,
              first_name: firstName,
              last_name: null,
              email: data.user!.email || email,
              phone,
              avatar_url: null,
              role: 'customer',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
            onSuccess?.();
            onClose();
          } else {
            setInfoMessage('Verification email sent! Please check your inbox.');
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          setSession(data.session);
          setUser(data.user);
          // fetch or set profile
          setProfile({
            id: data.user.id,
            first_name: data.user.user_metadata?.first_name || 'Customer',
            last_name: null,
            email: data.user.email || email,
            phone: data.user.user_metadata?.phone || null,
            avatar_url: null,
            role: email.includes('admin') ? 'admin' : 'customer',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
          onSuccess?.();
          onClose();
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Authentication failed. Please verify credentials.');
      } finally {
        setIsLoading(false);
      }
    } else {
      // Local demo sign-in (instant sign-in when Supabase keys are not yet configured)
      setTimeout(() => {
        const mockUser: any = {
          id: `usr-${Date.now()}`,
          email: email || 'visitor@kesarivan.in',
          aud: 'authenticated',
          role: 'authenticated',
          app_metadata: {},
          user_metadata: { first_name: firstName || 'Rajesh' },
          created_at: new Date().toISOString(),
        };

        setUser(mockUser);
        setSession({} as any);
        setProfile({
          id: mockUser.id,
          first_name: firstName || 'Rajesh',
          last_name: 'Patel',
          email: mockUser.email,
          phone: phone || '+91 98765 43210',
          avatar_url: null,
          role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        setIsLoading(false);
        onSuccess?.();
        onClose();
      }, 600);
    }
  }

  // Quick Demo / Admin Sign-in
  function handleDemoSignIn(role: 'customer' | 'admin') {
    const mockUser: any = {
      id: role === 'admin' ? 'admin-uuid-001' : 'cust-uuid-001',
      email: role === 'admin' ? 'admin@kesarivan.in' : 'rajesh.patel@example.com',
      aud: 'authenticated',
      role: 'authenticated',
      app_metadata: {},
      user_metadata: { first_name: role === 'admin' ? 'Orchard Admin' : 'Rajesh' },
      created_at: new Date().toISOString(),
    };

    setUser(mockUser);
    setSession({} as any);
    setProfile({
      id: mockUser.id,
      first_name: role === 'admin' ? 'Yash' : 'Rajesh',
      last_name: role === 'admin' ? '(Admin)' : 'Patel',
      email: mockUser.email,
      phone: '+91 98765 43210',
      avatar_url: null,
      role: role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    onSuccess?.();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-softer shadow-elevated border border-charcoal/10 max-w-md w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 relative space-y-6 animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-charcoal/50 hover:text-charcoal p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-1">
          <img src="/logo-dark.svg" alt="Kesari Van" className="h-12 w-auto mx-auto mb-2 object-contain" />
          <h3 className="font-display text-3xl text-charcoal">
            {mode === 'login' ? 'Welcome to the Orchard' : 'Create an Account'}
          </h3>
          <p className="font-body text-xs text-charcoal/60">
            {mode === 'login'
              ? 'Sign in to track orders, tree adoptions, and visits.'
              : 'Join Kesari Van to adopt trees and receive seasonal harvest updates.'}
          </p>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-soft text-xs font-body">
            {errorMessage}
          </div>
        )}

        {infoMessage && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-soft text-xs font-body">
            {infoMessage}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && (
            <>
              <Input
                label="Full Name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Rajesh Patel"
              />
              <Input
                label="Mobile Number (WhatsApp)"
                required
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number"
              />
            </>
          )}

          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={isLoading}>
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Quick Admin Access Button (login mode only) */}
        {mode === 'login' && (
          <div className="pt-2 border-t border-charcoal/10 text-center space-y-2">
            <p className="text-[11px] font-body text-charcoal/50 uppercase tracking-wider">
              Quick Admin Access
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => handleDemoSignIn('admin')}
                className="text-xs px-4 py-1.5 rounded bg-deep-forest text-white hover:bg-black font-body font-medium transition-colors"
              >
                Sign In as Admin
              </button>
            </div>
          </div>
        )}

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'login' ? 'signup' : 'login');
              setErrorMessage('');
            }}
            className="text-xs font-body text-orchard-green hover:underline font-medium"
          >
            {mode === 'login'
              ? "Don't have an account yet? Register here"
              : 'Already have an account? Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

