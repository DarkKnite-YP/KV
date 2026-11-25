import React, { useId } from 'react';

export type LogoVariant = 'primary' | 'secondary' | 'mark';
export type LogoTone = 'dark' | 'light';

interface BrandLogoProps {
  variant?: LogoVariant;
  tone?: LogoTone;
  className?: string;
  showTagline?: boolean;
}

/**
 * Kesari Van 3-Tier Brand Logo Family:
 * - primary: Horizontal signature lockup (header, wide banners)
 * - secondary: Stacked luxury crest lockup (footer, modals, certificates, slips)
 * - mark: Stripped-down iconic Saffron Mango & Leaf crest (favicons, mobile stamps, tiny spaces)
 */
export function BrandLogo({
  variant = 'primary',
  tone = 'dark',
  className = '',
  showTagline = true,
}: BrandLogoProps) {
  const uid = useId().replace(/:/g, '');
  const mangoGradId = `kv-mango-${uid}`;
  const goldGradId = `kv-gold-${uid}`;

  const textColor = tone === 'light' ? 'text-[#F7F2E8]' : 'text-[#21402E]';
  const subTextColor = tone === 'light' ? 'text-[#D4AF37]' : 'text-[#6A5A2B]';
  const leafColor = tone === 'light' ? '#84A98C' : '#2D5A3F';
  const leafHighlight = tone === 'light' ? '#B7D3BE' : '#4E8663';

  const CrestMark = ({ sizeClass }: { sizeClass: string }) => (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={sizeClass}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={mangoGradId} x1="20" y1="14" x2="46" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFC837" />
          <stop offset="52%" stopColor="#FF8800" />
          <stop offset="100%" stopColor="#D95204" />
        </linearGradient>
        <linearGradient id={goldGradId} x1="10" y1="10" x2="54" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3D88B" />
          <stop offset="100%" stopColor="#C89B2B" />
        </linearGradient>
      </defs>

      {/* Sun Halo Arc */}
      <path
        d="M12.5 34C11.5 21 20.5 10.5 33.5 10C43 9.6 51.5 15.5 54 24.5"
        stroke={`url(#${goldGradId})`}
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* Orchard Stem */}
      <path
        d="M32 15.5C31.5 11 29.5 8 26.5 6.8"
        stroke={`url(#${goldGradId})`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />

      {/* Botanical Leaf */}
      <path
        d="M32.5 15.5C34 9.5 40.5 6 48 7.5C45 13.5 39 16.5 32.5 15.5Z"
        fill={leafColor}
      />
      <path
        d="M33.5 14.5C37.5 11.8 42 10 46.5 8.5"
        stroke={leafHighlight}
        strokeWidth="1.1"
        strokeLinecap="round"
      />

      {/* Sculpted Gir Kesar Mango with Signature Beak */}
      <path
        d="M33 15.5C43.8 15.5 50.8 24.2 50 35.8C49.2 46.2 40.5 54.5 29.2 55.2C22.4 55.6 18.4 51.4 21.6 47.4C24.5 43.8 22.8 39.2 20.4 34.4C16.8 25.8 22.4 15.5 33 15.5Z"
        fill={`url(#${mangoGradId})`}
      />

      {/* Inner Glossy Crescent */}
      <path
        d="M27.2 21.8C23.5 25.4 23.2 31.8 26.2 36.8"
        stroke="#FFF4D6"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.72"
      />

      {/* Luxury Sparkle Seal */}
      <path
        d="M52.5 10.5L53.8 13.4L56.7 14.7L53.8 16L52.5 18.9L51.2 16L48.3 14.7L51.2 13.4Z"
        fill={`url(#${goldGradId})`}
      />
    </svg>
  );

  if (variant === 'mark') {
    return (
      <span className={`inline-flex items-center justify-center select-none ${className}`}>
        <CrestMark sizeClass="w-full h-full" />
      </span>
    );
  }

  if (variant === 'secondary') {
    return (
      <span className={`inline-flex flex-col items-center text-center select-none group ${className}`}>
        <CrestMark sizeClass="w-12 h-12 md:w-14 md:h-14 mb-1.5 transition-transform duration-300 group-hover:scale-105" />
        <span
          className={`font-display text-2xl md:text-[26px] font-semibold tracking-[0.14em] uppercase leading-none ${textColor}`}
        >
          Kesari Van
        </span>
        {showTagline && (
          <span className="mt-1.5 flex items-center gap-2">
            <span className="h-px w-4 bg-dawn-gold/60" />
            <span className={`font-body text-[9px] font-semibold tracking-[0.26em] uppercase ${subTextColor}`}>
              Gir Kesar · Surat
            </span>
            <span className="h-px w-4 bg-dawn-gold/60" />
          </span>
        )}
      </span>
    );
  }

  // Primary horizontal signature lockup
  return (
    <span className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      <CrestMark sizeClass="w-9 h-9 md:w-11 md:h-11 flex-shrink-0 transition-transform duration-300 group-hover:scale-105" />
      <span className="flex flex-col text-left">
        <span
          className={`font-display text-xl md:text-2xl font-semibold tracking-[0.1em] uppercase leading-none ${textColor}`}
        >
          Kesari Van
        </span>
        {showTagline && (
          <span className={`font-body text-[8.5px] md:text-[9px] font-semibold tracking-[0.24em] uppercase mt-1 ${subTextColor}`}>
            Gir Kesar · Surat
          </span>
        )}
      </span>
    </span>
  );
}
