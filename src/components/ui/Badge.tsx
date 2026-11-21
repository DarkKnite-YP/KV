import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'green' | 'gold' | 'sage' | 'earth' | 'red' | 'neutral';
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses = {
  green: 'bg-orchard-green/10 text-orchard-green',
  gold: 'bg-dawn-gold/15 text-dawn-gold',
  sage: 'bg-soft-sage text-charcoal',
  earth: 'bg-earth-brown/10 text-earth-brown',
  red: 'bg-red-50 text-red-700',
  neutral: 'bg-charcoal/5 text-charcoal/70',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
};

export function Badge({
  children,
  variant = 'green',
  size = 'sm',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-body font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </span>
  );
}

