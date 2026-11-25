import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { ChevronLeft, ChevronRight, Camera } from 'lucide-react';

interface TreeImageSliderProps {
  photos: string[];
  alt: string;
  className?: string;
  autoSlideIntervalMs?: number;
  showCountBadge?: boolean;
}

export function TreeImageSlider({
  photos,
  alt,
  className = '',
  autoSlideIntervalMs = 0,
  showCountBadge = true,
}: TreeImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dragX = useMotionValue(0);
  const pointerStartX = useRef<number | null>(null);
  const lastMoveTime = useRef<number>(0);
  const lastMoveX = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const didDrag = useRef<boolean>(false);

  const count = photos.length;

  useEffect(() => {
    if (activeIndex >= count) {
      setActiveIndex(0);
    }
  }, [count, activeIndex]);

  useEffect(() => {
    if (count <= 1 || !autoSlideIntervalMs || isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % count);
    }, autoSlideIntervalMs);
    return () => clearInterval(timer);
  }, [count, autoSlideIntervalMs, isPaused]);

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev - 1 + count) % count);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % count);
  };

  // Rubber-band end resistance when pulling past first/last slide
  const applyEndResistance = (delta: number) => {
    const atStart = activeIndex === 0 && delta > 0;
    const atEnd = activeIndex === count - 1 && delta < 0;
    if (atStart || atEnd || count <= 1) {
      const sign = delta >= 0 ? 1 : -1;
      const abs = Math.abs(delta);
      return sign * (abs / (1 + abs * 0.015));
    }
    return delta;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (count === 0) return;
    pointerStartX.current = e.clientX;
    lastMoveX.current = e.clientX;
    lastMoveTime.current = performance.now();
    velocityRef.current = 0;
    didDrag.current = false;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const rawDelta = e.clientX - pointerStartX.current;
    if (Math.abs(rawDelta) > 6) {
      didDrag.current = true;
    }
    const now = performance.now();
    const dt = Math.max(1, now - lastMoveTime.current);
    velocityRef.current = ((e.clientX - lastMoveX.current) / dt) * 1000;
    lastMoveX.current = e.clientX;
    lastMoveTime.current = now;

    dragX.set(applyEndResistance(rawDelta));
  };

  const handlePointerUpOrCancel = () => {
    if (pointerStartX.current === null) return;
    const delta = dragX.get();
    const velocity = velocityRef.current;
    pointerStartX.current = null;

    if (count > 1) {
      const width = containerRef.current?.clientWidth || 280;
      const threshold = Math.min(60, width * 0.22);
      if (delta < -threshold || velocity < -380) {
        if (activeIndex < count - 1) setActiveIndex((prev) => prev + 1);
      } else if (delta > threshold || velocity > 380) {
        if (activeIndex > 0) setActiveIndex((prev) => prev - 1);
      }
    }

    // Hand off to velocity-preserving spring back to 0 (bounce: 0)
    animate(dragX, 0, {
      type: 'spring',
      duration: 0.5,
      bounce: 0,
      velocity,
    });
  };

  if (count === 0) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-soft-sage/40 to-mango-cream text-charcoal/70 ${className}`}>
        <span className="text-5xl drop-shadow-sm select-none">🌳</span>
        <span className="text-[11px] font-body text-charcoal/50 mt-2">Gir Kesar Tree</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden group select-none touch-pan-y ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        handlePointerUpOrCancel();
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={(e) => {
        if (didDrag.current) e.stopPropagation();
        handlePointerUpOrCancel();
      }}
      onPointerCancel={handlePointerUpOrCancel}
    >
      {/* Sliding Track with transform-only animation + drag offset */}
      <motion.div
        className="flex w-full h-full"
        style={{ x: dragX }}
      >
        <div
          className="flex w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {photos.map((src, idx) => (
            <div key={`${idx}-${src.slice(0, 24)}`} className="w-full h-full flex-shrink-0">
              <img
                src={src}
                alt={`${alt} — photo ${idx + 1}`}
                className="w-full h-full object-cover pointer-events-none"
                loading="lazy"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Multi-photo Navigation Controls */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous tree photo"
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center shadow-md transition-opacity sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            aria-label="Next tree photo"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center shadow-md transition-opacity sm:opacity-0 sm:group-hover:opacity-100 focus:opacity-100 z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Dot Indicators */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/35 backdrop-blur-xs px-2 py-1 rounded-full z-10">
            {photos.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                }}
                aria-label={`View photo ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  activeIndex === idx ? 'w-4 bg-dawn-gold' : 'w-1.5 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Photo Count Badge */}
      {showCountBadge && (
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs rounded-full px-2 py-0.5 text-[10px] font-body font-medium text-white flex items-center gap-1 z-10">
          <Camera className="w-3 h-3" />
          {count > 1 ? `${activeIndex + 1}/${count}` : '1'}
        </div>
      )}
    </div>
  );
}
