import React from 'react';
import { Link } from 'react-router-dom';
import { FOOTER_LINKS, BRAND } from '../../lib/constants';
import { Container } from '../ui/Container';
import { BrandLogo } from '../ui/BrandLogo';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-deep-forest text-white">
      {/* Main Footer */}
      <div className="py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand Column (Secondary Stacked Crest Logo) */}
            <div className="lg:col-span-1">
              <Link
                to="/"
                className="inline-block hover:opacity-95 transition-opacity mb-3"
                aria-label="Kesari Van"
              >
                <BrandLogo variant="secondary" tone="light" className="!items-start !text-left" />
              </Link>
              <p className="font-body text-sm text-white/60 mt-2 leading-relaxed max-w-xs">
                A mango orchard in Surat, Gujarat. Growing Gir Kesar with care,
                season by season.
              </p>
              <p className="font-display text-lg italic text-dawn-gold mt-4">
                {BRAND.tagline}
              </p>
            </div>

            {/* Explore */}
            <div>
              <h3 className="font-body text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
                Explore
              </h3>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.explore.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="font-body text-sm text-white/60 hover:text-dawn-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-body text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
                Connect
              </h3>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.connect.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="font-body text-sm text-white/60 hover:text-dawn-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Policies */}
            <div>
              <h3 className="font-body text-sm font-semibold uppercase tracking-wider text-white/80 mb-4">
                Policies
              </h3>
              <ul className="space-y-2.5">
                {FOOTER_LINKS.policies.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="font-body text-sm text-white/60 hover:text-dawn-gold transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <Container>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-body text-xs text-white/40">
              © {currentYear} Kesari Van. All rights reserved.
            </p>
            <p className="font-body text-xs text-white/40">
              {BRAND.location}
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}

