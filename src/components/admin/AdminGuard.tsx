import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Lock, KeyRound, ArrowLeft, LogOut, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Button, Input, Badge, BrandLogo } from '../ui';

interface AdminGuardProps {
  children: React.ReactNode;
}

const MASTER_PIN = import.meta.env.VITE_ADMIN_MASTER_PIN || '201023';
const PIN_STORAGE_KEY = 'kv_admin_pin_session_v1';
const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export default function AdminGuard({ children }: AdminGuardProps) {
  const { user, profile, isLoading, signOut } = useAuth();

  // Master PIN states
  const [isPinUnlocked, setIsPinUnlocked] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem(PIN_STORAGE_KEY);
      if (!stored) return false;
      const parsed = JSON.parse(stored);
      if (parsed.verified && Date.now() - parsed.timestamp < TWENTY_FOUR_HOURS_MS) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  });

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinShakeKey, setPinShakeKey] = useState(0);
  const [remember24h, setRemember24h] = useState(true);

  // Email / Password login states for unauthenticated admin
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginShakeKey, setLoginShakeKey] = useState(0);

  // Check Supabase authorization
  const isAuthorizedAdmin = Boolean(
    user && (
      profile?.role === 'admin' ||
      user.email?.toLowerCase() === 'yashjpatel369@gmail.com'
    )
  );

  function handleVerifyPin(e: React.FormEvent) {
    e.preventDefault();
    setPinError('');

    if (enteredPin.trim() === MASTER_PIN) {
      setIsPinUnlocked(true);
      if (remember24h) {
        try {
          localStorage.setItem(
            PIN_STORAGE_KEY,
            JSON.stringify({ verified: true, timestamp: Date.now() })
          );
        } catch (err) {
          console.warn('Storage unavailable', err);
        }
      }
    } else {
      setPinError('Incorrect Master Security PIN. Please try again.');
      setEnteredPin('');
      setPinShakeKey((k) => k + 1);
    }
  }

  async function handleAdminEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: adminEmail.trim(),
        password: adminPassword,
      });

      if (error) {
        setLoginError(error.message);
        setLoginShakeKey((k) => k + 1);
      }
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed');
      setLoginShakeKey((k) => k + 1);
    } finally {
      setIsLoggingIn(false);
    }
  }

  async function handleGoogleLogin() {
    setLoginError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/admin',
        },
      });
      if (error) setLoginError(error.message);
    } catch (err: any) {
      setLoginError(err.message || 'Google login failed');
    }
  }

  function handleLockConsole() {
    try {
      localStorage.removeItem(PIN_STORAGE_KEY);
    } catch {}
    setIsPinUnlocked(false);
    setEnteredPin('');
  }

  // 1. Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-mango-cream flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-orchard-green animate-spin mb-4" />
        <p className="font-body text-xs text-charcoal/60 uppercase tracking-widest font-semibold">
          Verifying Security Credentials...
        </p>
      </div>
    );
  }

  // 2. Unauthenticated: Show Admin Security Login Gate
  if (!user) {
    return (
      <div className="min-h-screen bg-mango-cream flex items-center justify-center p-4 md:p-8">
        <div className="bg-white rounded-softer shadow-card border border-charcoal/10 max-w-md w-full p-8 md:p-10 space-y-6 text-center animate-fade-in">
          <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
            <BrandLogo variant="secondary" tone="dark" />
          </Link>

          <div className="space-y-2">
            <Badge variant="gold">Restricted Access</Badge>
            <h2 className="font-display text-3xl text-charcoal font-semibold">Orchard Operations Gate</h2>
            <p className="font-body text-xs text-charcoal/60 leading-relaxed">
              Sign in with your verified administrator credentials to access grove controls, live harvest dispatches, and tree telemetry.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded font-body">
              {loginError}
            </div>
          )}

          {/* Google OAuth Login */}
          <Button
            type="button"
            onClick={handleGoogleLogin}
            variant="outline"
            size="md"
            fullWidth
            className="flex items-center justify-center gap-2 border-charcoal/20"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Sign In with Google Admin
          </Button>

          <div className="flex items-center gap-3">
            <hr className="flex-1 border-charcoal/10" />
            <span className="text-[11px] font-body text-charcoal/40 uppercase tracking-widest">or email</span>
            <hr className="flex-1 border-charcoal/10" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleAdminEmailLogin} className="space-y-3.5 text-left font-body">
            <Input
              label="Admin Email"
              type="email"
              required
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="admin@kesarivan.in"
            />

            <div key={loginShakeKey > 0 ? `login-shake-${loginShakeKey}` : undefined} className={`space-y-1 ${loginShakeKey > 0 ? 'animate-kv-shake' : ''}`}>
              <label className="block text-xs font-medium text-charcoal/70">Admin Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={adminPassword}
                  onChange={(e) => {
                    setAdminPassword(e.target.value);
                    if (loginError) setLoginError('');
                  }}
                  placeholder="••••••••••••"
                  className={`w-full px-3.5 py-2.5 text-sm rounded-soft border focus:outline-none transition-colors ${
                    loginError ? 'border-red-500 focus:border-red-500' : 'border-charcoal/20 focus:border-orchard-green'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-charcoal"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="gold"
              size="md"
              fullWidth
              disabled={isLoggingIn}
              className="mt-2"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...
                </>
              ) : (
                'Unlock Admin Operations'
              )}
            </Button>
          </form>

          <div className="pt-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-body text-charcoal/60 hover:text-charcoal transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Kesari Van Website
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Logged in, but NOT an authorized admin email / role
  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-mango-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-softer shadow-card border border-charcoal/10 max-w-md w-full p-8 md:p-10 space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="neutral">Access Denied</Badge>
            <h2 className="font-display text-2xl md:text-3xl text-charcoal font-semibold">Administrative Access Restricted</h2>
            <p className="font-body text-xs text-charcoal/70 leading-relaxed">
              Signed in as <strong className="text-charcoal">{user.email}</strong>. This account does not possess grove management permissions.
            </p>
          </div>

          <div className="p-3 bg-charcoal/5 rounded border border-charcoal/10 text-xs font-body text-charcoal/60 text-left">
            Orchard operations are strictly confined to authorized administrator accounts.
          </div>

          <div className="space-y-2 pt-2">
            <Button onClick={() => signOut()} variant="outline" size="sm" fullWidth>
              <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out & Switch Account
            </Button>
            <Button href="/" variant="ghost" size="sm" fullWidth>
              Return to Website
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 4. Logged in as Admin, but Master PIN is locked
  if (!isPinUnlocked) {
    return (
      <div className="min-h-screen bg-mango-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-softer shadow-card border border-charcoal/10 max-w-sm w-full p-8 md:p-10 space-y-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-soft-sage text-orchard-green flex items-center justify-center mx-auto">
            <KeyRound className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <Badge variant="green">Identity Verified</Badge>
            <h2 className="font-display text-2xl font-bold text-charcoal">Security Challenge</h2>
            <p className="font-body text-xs text-charcoal/60">
              Welcome, <strong className="text-charcoal">{profile?.first_name || user.email}</strong>. Enter your Master Security PIN to unlock the operational console.
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="space-y-4">
            <div key={pinShakeKey > 0 ? `pin-shake-${pinShakeKey}` : undefined} className={pinShakeKey > 0 ? 'animate-kv-shake' : ''}>
              <input
                type="password"
                inputMode="numeric"
                maxLength={10}
                required
                autoFocus
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  if (pinError) setPinError('');
                }}
                placeholder="Enter Master PIN"
                className={`w-full text-center tracking-[0.4em] font-mono text-xl py-3 px-4 rounded-soft border focus:outline-none transition-colors ${
                  pinError ? 'border-red-500 bg-red-50/40 focus:border-red-500' : 'border-charcoal/20 focus:border-orchard-green bg-charcoal/5'
                }`}
              />
              {pinError && <p className="text-xs text-red-600 font-body mt-2">{pinError}</p>}
            </div>

            <label className="flex items-center justify-center gap-2 font-body text-xs text-charcoal/70 cursor-pointer">
              <input
                type="checkbox"
                checked={remember24h}
                onChange={(e) => setRemember24h(e.target.checked)}
                className="accent-orchard-green rounded"
              />
              <span>Remember unlocked for 24 hours</span>
            </label>

            <Button type="submit" variant="gold" size="lg" fullWidth className="shadow-md">
              Unlock Operations
            </Button>
          </form>

          <div className="pt-2 flex items-center justify-between text-xs font-body text-charcoal/50">
            <Link to="/" className="hover:text-charcoal flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Home
            </Link>
            <button onClick={() => signOut()} className="hover:text-red-600 flex items-center gap-1">
              <LogOut className="w-3 h-3" /> Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. Authenticated & PIN Unlocked: Render Admin Console
  return (
    <>
      {/* Discreet floating console lock shortcut in corner */}
      <div className="fixed bottom-4 right-4 z-50 print:hidden">
        <button
          onClick={handleLockConsole}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-deep-forest text-white/90 hover:text-white rounded-full text-[11px] font-body shadow-lg border border-white/10 hover:bg-black transition-all"
          title="Lock Console (Require PIN again)"
        >
          <Lock className="w-3 h-3 text-dawn-gold" />
          <span>Lock Console</span>
        </button>
      </div>

      {children}
    </>
  );
}
