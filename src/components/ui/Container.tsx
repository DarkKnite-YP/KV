import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  narrow?: boolean;
  wide?: boolean;
}

export function Container({
  children,
  className = '',
  narrow = false,
  wide = false,
}: ContainerProps) {
  const maxWidth = narrow
    ? 'max-w-reading'
    : wide
    ? 'max-w-wide'
    : 'max-w-content';

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidth} ${className}`}>
      {children}
    </div>
  );
}

