'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

export interface PatternBackgroundProps {
  pattern?: 'geometric' | 'circuit' | 'dots' | 'waves' | 'hero-gradient';
  opacity?: number;
  overlay?: boolean;
  children?: ReactNode;
  className?: string;
}

const PATTERN_FILES = {
  geometric: 'geometric-grid-subtle.png',
  circuit: 'circuit-board-pattern.png',
  dots: 'dot-matrix-pattern.png',
  waves: 'wave-pattern-flow.png',
  'hero-gradient': 'hero-gradient-background.png',
};

const PATTERN_PATHS = {
  geometric: '/backgrounds/geometric-grid-subtle.png',
  circuit: '/backgrounds/circuit-board-pattern.png',
  dots: '/backgrounds/dot-matrix-pattern.png',
  waves: '/backgrounds/wave-pattern-flow.png',
  'hero-gradient': '/backgrounds/hero-gradient-background.png',
};

export function PatternBackground({
  pattern = 'geometric',
  opacity = 0.1,
  overlay = true,
  children,
  className,
}: PatternBackgroundProps) {
  const isGradient = pattern === 'hero-gradient';

  if (isGradient) {
    return (
      <div className={cn('pattern-background hero-gradient', className)}>
        {overlay && (
          <div className="pattern-overlay" style={{ opacity: opacity }} />
        )}
        {children}
      </div>
    );
  }

  return (
    <div className={cn('pattern-background', className)}>
      {/* Pattern Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: opacity }}
      >
        <div
          className="w-full h-full opacity-50"
          style={{
            backgroundImage: `url(${PATTERN_PATHS[pattern]})`,
            backgroundRepeat: 'repeat',
            backgroundSize: 'auto',
          }}
        />
      </div>

      {/* Overlay for additional control */}
      {overlay && <div className="pattern-overlay bg-background/20" />}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

export default PatternBackground;
