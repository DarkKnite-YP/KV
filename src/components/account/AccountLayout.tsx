import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { Container, Button } from '../ui';
import { useAuth } from '../../hooks/useAuth';
import { AuthModal } from '../auth/AuthModal';
import {
  LayoutDashboard,
  ShoppingBag,
  Trees,
  MapPin,
  User,
  Calendar,
  HelpCircle,
  LogOut,
  Lock,
} from 'lucide-react';

interface AccountLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export function AccountLayout({ children, title, subtitle }: AccountLayoutProps) {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const navItems = [
    { label: 'Overview', href: '/account', icon: LayoutDashboard, end: true },
    { label: 'My Orders', href: '/account/orders', icon: ShoppingBag },
    { label: 'My Adopted Trees', href: '/account/adoptions', icon: Trees },
    { label: 'My Addresses', href: '/account/addresses', icon: MapPin },
    { label: 'My Profile', href: '/account/profile', icon: User },
    { label: 'My Orchard Visits', href: '/account/visits', icon: Calendar },
  ];

  async function handleLogout() {
    await signOut();
    navigate('/');
  }

  if (!user) {
    return (
      <div className="pt-28 pb-20 bg-mango-cream min-h-[70vh] flex items-center justify-center">
        <Container narrow>
          <div className="bg-white p-8 md:p-12 rounded-softer shadow-card border border-charcoal/10 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-soft-sage/50 text-orchard-green flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8 text-orchard-green" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-charcoal">Sign In to Your Account</h2>
            <p className="font-body text-sm text-charcoal/70 max-w-md mx-auto leading-relaxed">
              Please log in to manage your active mango orders, review tree adoption progress, and book orchard visits.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button onClick={() => setIsAuthOpen(true)} variant="gold" size="lg" className="w-full sm:w-auto shadow-md">
                Sign In / Create Account
              </Button>
              <Button href="/" variant="ghost" size="sm" className="w-full sm:w-auto">
                Return to Home
              </Button>
            </div>
          </div>
          <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
        </Container>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-mango-cream min-h-screen">
      <Container>
        {/* Header greeting */}
        <div className="mb-8">
          <h1 className="font-display text-3xl md:text-4xl text-charcoal">
            {title || `Welcome back, ${profile?.first_name || 'Friend'}`}
          </h1>
          <p className="font-body text-xs md:text-sm text-charcoal/60 mt-1">
            {subtitle || 'A little space to keep track of everything growing with us.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Nav Left */}
          <aside className="lg:col-span-3 bg-white rounded-softer shadow-card border border-charcoal/10 p-4 space-y-1">
            <nav className="space-y-1 font-body text-sm" aria-label="Account navigation">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.href}
                    to={item.href}
                    end={item.end}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-soft transition-colors ${
                        isActive
                          ? 'bg-soft-sage text-deep-forest font-semibold'
                          : 'text-charcoal/70 hover:bg-mango-cream hover:text-charcoal'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 text-orchard-green" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}

              <hr className="my-2 border-charcoal/10" />

              <Link
                to="/faq"
                className="flex items-center gap-3 px-4 py-3 rounded-soft text-charcoal/70 hover:bg-mango-cream hover:text-charcoal transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-orchard-green" />
                <span>Help & FAQ</span>
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-soft text-red-700 hover:bg-red-50 transition-colors text-left font-body text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </nav>
          </aside>

          {/* Main Content Right */}
          <main className="lg:col-span-9 space-y-6">
            {children}
          </main>
        </div>
      </Container>
    </div>
  );
}

