import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  dark?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
  dark = false,
}: SectionHeadingProps) {
  const alignClasses = align === 'center' ? 'text-center mx-auto' : 'text-left';

  return (
    <div className={`max-w-3xl ${alignClasses} ${className}`}>
      {eyebrow && (
        <p
          className={`font-body text-xs md:text-sm font-medium tracking-[0.15em] uppercase mb-3 ${
            dark ? 'text-dawn-gold' : 'text-dawn-gold'
          }`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`font-display text-section ${
          dark ? 'text-white' : 'text-charcoal'
        } text-balance`}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`font-body text-base md:text-lg mt-3 md:mt-4 leading-relaxed text-pretty ${
            dark ? 'text-white/80' : 'text-charcoal/70'
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

