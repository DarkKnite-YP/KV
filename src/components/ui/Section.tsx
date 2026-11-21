import React from 'react';

interface SectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'cream' | 'sage' | 'white' | 'forest' | 'green';
  padding?: 'default' | 'small' | 'large' | 'none';
  narrow?: boolean;
}

const bgClasses = {
  cream: 'bg-mango-cream',
  sage: 'bg-soft-sage',
  white: 'bg-white',
  forest: 'bg-deep-forest text-white',
  green: 'bg-orchard-green text-white',
};

const paddingClasses = {
  default: 'py-section',
  small: 'py-section-sm',
  large: 'py-[clamp(5rem,10vw,10rem)]',
  none: 'py-0',
};

export function Section({
  children,
  className = '',
  id,
  background = 'cream',
  padding = 'default',
  narrow = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${bgClasses[background]} ${paddingClasses[padding]} ${className}`}
    >
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 ${
          narrow ? 'max-w-reading' : 'max-w-content'
        }`}
      >
        {children}
      </div>
    </section>
  );
}

