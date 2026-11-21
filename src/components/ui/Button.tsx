import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  isLoading?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const baseStyles =
  'inline-flex items-center justify-center font-body font-medium transition-all duration-200 rounded-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orchard-green disabled:opacity-50 disabled:cursor-not-allowed select-none';

const variants = {
  primary:
    'bg-orchard-green text-white hover:bg-deep-forest active:bg-deep-forest',
  secondary:
    'bg-soft-sage text-charcoal hover:bg-soft-sage/80 active:bg-soft-sage/70',
  outline:
    'border-2 border-orchard-green text-orchard-green hover:bg-orchard-green hover:text-white active:bg-deep-forest',
  ghost:
    'text-orchard-green hover:bg-soft-sage/50 active:bg-soft-sage/70',
  gold:
    'bg-dawn-gold text-white hover:bg-dawn-gold/90 active:bg-dawn-gold/80',
};

const sizes = {
  sm: 'text-sm px-4 py-2 gap-1.5',
  md: 'text-sm px-6 py-3 gap-2',
  lg: 'text-base px-8 py-4 gap-2.5',
};

export function Button({
  variant = 'primary',
  size = 'md',
  href,
  isLoading,
  fullWidth,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${
    fullWidth ? 'w-full' : ''
  } ${className}`;

  if (href) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}

