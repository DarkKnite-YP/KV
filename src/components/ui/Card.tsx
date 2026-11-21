import React from 'react';
import { Link } from 'react-router-dom';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  className = '',
  href,
  hover = false,
  padding = 'md',
}: CardProps) {
  const baseClasses = `bg-white rounded-softer shadow-card overflow-hidden ${paddingClasses[padding]} ${
    hover ? 'transition-shadow duration-200 hover:shadow-card-hover' : ''
  } ${className}`;

  if (href) {
    return (
      <Link to={href} className={`block ${baseClasses}`}>
        {children}
      </Link>
    );
  }

  return <div className={baseClasses}>{children}</div>;
}

