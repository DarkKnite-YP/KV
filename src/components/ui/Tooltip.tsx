import React, { useState, useRef, useEffect } from 'react';

// Shared warm-up tracker: first tooltip waits 350ms, subsequent ones open instantly while warm
let lastTooltipClosedAt = 0;
let activeTooltipCount = 0;
const WARM_WINDOW_MS = 600;
const INITIAL_DELAY_MS = 350;

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className = '' }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const isWarm = activeTooltipCount > 0 || Date.now() - lastTooltipClosedAt < WARM_WINDOW_MS;
    if (isWarm) {
      activeTooltipCount += 1;
      setIsOpen(true);
    } else {
      timerRef.current = setTimeout(() => {
        activeTooltipCount += 1;
        setIsOpen(true);
      }, INITIAL_DELAY_MS);
    }
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (isOpen) {
      activeTooltipCount = Math.max(0, activeTooltipCount - 1);
      lastTooltipClosedAt = Date.now();
      setIsOpen(false);
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <span
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      onBlur={handleMouseLeave}
    >
      {children}
      {isOpen && (
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2.5 py-1.5 rounded-soft bg-deep-forest text-white text-[11px] font-body whitespace-nowrap shadow-elevated z-50 animate-fade-in"
        >
          {content}
        </span>
      )}
    </span>
  );
}
