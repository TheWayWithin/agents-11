'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import PatternBackground from './pattern-background';

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  children?: ReactNode;
  illustration?: string;
  backgroundPattern?:
    | 'geometric'
    | 'circuit'
    | 'dots'
    | 'waves'
    | 'hero-gradient';
  className?: string;
  contentAlign?: 'left' | 'center' | 'right';
  layout?: 'centered' | 'split';
}

const ILLUSTRATION_PATHS = {
  hero: '/illustrations/hero-solopreneur-with-ai-agents.png',
  coordination: '/illustrations/marketplace-coordination.png',
  roi: '/illustrations/roi-timeline-visualization.png',
  loading: '/illustrations/loading-agents.png',
  'no-agents': '/illustrations/no-agents-selected.png',
};

export function HeroSection({
  title,
  subtitle,
  description,
  children,
  illustration = 'hero',
  backgroundPattern = 'hero-gradient',
  className,
  contentAlign = 'center',
  layout = 'centered',
}: HeroSectionProps) {
  const alignmentClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const illustrationPath =
    ILLUSTRATION_PATHS[illustration as keyof typeof ILLUSTRATION_PATHS] ||
    illustration;

  if (layout === 'split') {
    return (
      <PatternBackground
        pattern={backgroundPattern}
        opacity={0.15}
        className={cn('hero-section', className)}
      >
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content Side */}
            <div
              className={cn(
                'space-y-6 fade-in',
                alignmentClasses[contentAlign]
              )}
            >
              {subtitle && (
                <p className="text-brand-orange font-semibold text-sm uppercase tracking-wide">
                  {subtitle}
                </p>
              )}

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
                {title}
              </h1>

              {description && (
                <p className="text-xl text-muted-foreground max-w-2xl leading-relaxed">
                  {description}
                </p>
              )}

              {children && <div className="slide-up">{children}</div>}
            </div>

            {/* Illustration Side */}
            <div className="relative slide-up">
              <div className="relative z-10">
                <Image
                  src={illustrationPath}
                  alt="Hero illustration"
                  width={600}
                  height={400}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>

              {/* Glow effect behind illustration */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-brand-orange/20 rounded-full blur-3xl -z-10 scale-75" />
            </div>
          </div>
        </div>
      </PatternBackground>
    );
  }

  // Centered layout
  return (
    <PatternBackground
      pattern={backgroundPattern}
      opacity={0.15}
      className={cn('hero-section', className)}
    >
      <div className="container mx-auto px-4">
        <div
          className={cn(
            'max-w-4xl mx-auto space-y-8',
            alignmentClasses[contentAlign]
          )}
        >
          {/* Illustration (if provided) */}
          {illustration && (
            <div className="relative mb-8 slide-up">
              <div className="relative z-10 max-w-md mx-auto">
                <Image
                  src={illustrationPath}
                  alt="Hero illustration"
                  width={400}
                  height={300}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>

              {/* Glow effect behind illustration */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-brand-orange/20 rounded-full blur-3xl -z-10 scale-50" />
            </div>
          )}

          {/* Content */}
          <div className="space-y-6 fade-in">
            {subtitle && (
              <p className="text-brand-orange font-semibold text-sm uppercase tracking-wide">
                {subtitle}
              </p>
            )}

            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight">
              {title}
            </h1>

            {description && (
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {children && <div className="slide-up">{children}</div>}
        </div>
      </div>
    </PatternBackground>
  );
}

export default HeroSection;
