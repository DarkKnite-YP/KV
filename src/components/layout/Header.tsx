import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, ShieldCheck } from 'lucide-react';
import { NAV_ITEMS } from '../../lib/constants';
import { useCartStore } from '../../stores/cartStore';
import { useAuthStore } from '../../stores/authStore';
import { Container } from '../ui/Container';
import { BrandLogo } from '../ui/BrandLogo';
import { AuthModal } from '../auth/AuthModal';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const location = useLocation();
  const totalItems = useCartStore((s) => s.totalItems());
  const { user, profile, isAdmin } = useAuthStore();

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // Handle scroll for transparent → solid transition
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomepage = location.pathname === '/';
  const headerBg =
    isScrolled || !isHomepage || isMenuOpen
      ? 'bg-mango-cream/95 backdrop-blur-md shadow-sm'
      : 'bg-transparent';
  const textColor =
    isScrolled || !isHomepage || isMenuOpen ? 'text-charcoal' : 'text-white';
  const logoColor =
    isScrolled || !isHomepage || isMenuOpen
      ? 'text-orchard-green'
      : 'text-white';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${headerBg}`}
      >
        <Container>
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Primary Logo */}
            <Link
              to="/"
              className="flex items-center group transition-opacity hover:opacity-95 py-1"
              aria-label="Kesari Van"
            >
              <BrandLogo
                variant="primary"
                tone={logoColor === 'text-white' ? 'light' : 'dark'}
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8" aria-label="Primary navigation">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`font-body text-sm font-medium ${textColor} hover:text-dawn-gold transition-colors ${
                    location.pathname === item.href ? 'text-dawn-gold font-semibold' : ''
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Utilities */}
            <div className="flex items-center gap-3">
              {/* Account / Login */}
              {user ? (
                <Link
                  to="/account"
                  className={`hidden md:flex items-center gap-2 p-2 rounded-full hover:bg-black/5 transition-colors ${textColor}`}
                  aria-label="My Account"
                  title={`Account: ${profile?.first_name || 'User'}`}
                >
                  <User className="w-5 h-5 text-orchard-green" />
                  <span className="text-xs font-body font-semibold max-w-[100px] truncate">
                    {profile?.first_name || 'Account'}
                  </span>
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthOpen(true)}
                  className={`hidden md:flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-full border border-current hover:bg-black/5 transition-colors ${textColor}`}
                >
                  <User className="w-4 h-4" /> Sign In
                </button>
              )}

              {/* Cart */}
              <Link
                to="/cart"
                className={`relative p-2 rounded-full hover:bg-black/5 transition-colors ${textColor}`}
                aria-label={`Cart (${totalItems} items)`}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-dawn-gold text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-fade-in">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`lg:hidden p-2 rounded-full hover:bg-black/5 transition-colors ${textColor}`}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </Container>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-mango-cream border-t border-charcoal/10 shadow-lg animate-fade-in">
            <Container>
              <nav className="py-4 space-y-1" aria-label="Mobile navigation">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={`block px-4 py-3 font-body text-base font-medium text-charcoal hover:text-orchard-green hover:bg-soft-sage/30 rounded-soft transition-colors ${
                      location.pathname === item.href ? 'text-orchard-green bg-soft-sage/30 font-semibold' : ''
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                <hr className="my-2 border-charcoal/10" />

                {user ? (
                  <Link
                    to="/account"
                    className="block px-4 py-3 font-body text-base font-medium text-charcoal hover:text-orchard-green hover:bg-soft-sage/30 rounded-soft transition-colors"
                  >
                    My Account ({profile?.first_name || 'Profile'})
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsAuthOpen(true);
                    }}
                    className="w-full text-left px-4 py-3 font-body text-base font-semibold text-orchard-green hover:bg-soft-sage/30 rounded-soft transition-colors"
                  >
                    Sign In / Register
                  </button>
                )}

                <Link
                  to="/contact"
                  className="block px-4 py-3 font-body text-base font-medium text-charcoal hover:text-orchard-green hover:bg-soft-sage/30 rounded-soft transition-colors"
                >
                  Contact
                </Link>
              </nav>
            </Container>
          </div>
        )}
      </header>

      {/* Supabase Authentication Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
}
