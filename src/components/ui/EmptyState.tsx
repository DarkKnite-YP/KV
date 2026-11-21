import React from 'react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: { label: string; href: string };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-4 ${className}`}
    >
      {icon && (
        <div className="text-charcoal/20 mb-4">{icon}</div>
      )}
      <h3 className="font-display text-xl md:text-2xl text-charcoal mb-2">
        {title}
      </h3>
      {description && (
        <p className="font-body text-sm text-charcoal/60 max-w-md mb-6">
          {description}
        </p>
      )}
      {action && (
        <Button href={action.href} variant="primary" size="md">
          {action.label}
        </Button>
      )}
    </div>
  );
}

