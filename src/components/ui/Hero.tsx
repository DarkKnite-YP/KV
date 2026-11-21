import React from 'react';
import { Button } from './Button';
import { Container } from './Container';

interface HeroProps {
  eyebrow?: string;
  headline: string;
  copy?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
  backgroundImage?: string;
  backgroundVideo?: string;
  overlay?: boolean;
  align?: 'left' | 'center';
  size?: 'default' | 'large' | 'small';
  className?: string;
}

export function Hero({
  eyebrow,
  headline,
  copy,
  primaryCTA,
  secondaryCTA,
  backgroundImage,
  backgroundVideo,
  overlay = true,
  align = 'center',
  size = 'default',
  className = '',
}: HeroProps) {
  const heightClasses = {
    default: 'min-h-[70vh] md:min-h-[80vh]',
    large: 'min-h-[85vh] md:min-h-[90vh]',
    small: 'min-h-[50vh] md:min-h-[60vh]',
  };

  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
  };

  return (
    <section
      className={`relative flex ${alignClasses[align]} justify-center ${heightClasses[size]} overflow-hidden ${className}`}
    >
      {/* Background */}
      {backgroundVideo ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster={backgroundImage}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      ) : backgroundImage ? (
        <img
          src={backgroundImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-deep-forest to-orchard-green" />
      )}

      {/* Overlay */}
      {overlay && (
        <div className="absolute inset-0 bg-deep-forest/50" />
      )}

      {/* Content */}
      <Container
        className={`relative z-10 flex flex-col ${alignClasses[align]} justify-center py-24 md:py-32`}
      >
        {eyebrow && (
          <p className="font-body text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-dawn-gold mb-4 md:mb-6">
            {eyebrow}
          </p>
        )}

        <h1 className="font-display text-hero text-white max-w-4xl text-balance">
          {headline}
        </h1>

        {copy && (
          <p className="font-body text-base md:text-lg text-white/85 max-w-2xl mt-4 md:mt-6 leading-relaxed text-pretty">
            {copy}
          </p>
        )}

        {(primaryCTA || secondaryCTA) && (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 md:mt-10">
            {primaryCTA && (
              <Button
                href={primaryCTA.href}
                variant="gold"
                size="lg"
                className="shadow-elevated hover:scale-[1.02] transition-transform"
              >
                {primaryCTA.label}
              </Button>
            )}
            {secondaryCTA && (
              <Button
                href={secondaryCTA.href}
                variant="outline-white"
                size="lg"
                className="shadow-sm hover:scale-[1.02] transition-transform"
              >
                {secondaryCTA.label}
              </Button>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

