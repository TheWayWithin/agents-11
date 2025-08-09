'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface BrandLogoProps {
  variant?:
    | 'horizontal'
    | 'icon'
    | 'stacked'
    | 'wordmark'
    | 'orange'
    | 'white'
    | 'black';
  size?: 'small' | 'medium' | 'large' | 'xlarge';
  className?: string;
  onClick?: () => void;
  priority?: boolean;
}

const LOGO_VARIANTS = {
  horizontal: 'agents11-logo-primary-horizontal.png',
  icon: 'agents11-logo-icon-only.png',
  stacked: 'agents11-logo-stacked-vertical.png',
  wordmark: 'agents11-wordmark-only.png',
  orange: 'agents11-logo-orange-accent.png',
  white: 'agents11-logo-reverse-white.png',
  black: 'agents11-logo-monochrome-black.png',
};

const SIZE_DIMENSIONS = {
  small: { width: 80, height: 32 },
  medium: { width: 120, height: 48 },
  large: { width: 160, height: 64 },
  xlarge: { width: 240, height: 96 },
};

// Icon-only dimensions (square)
const ICON_DIMENSIONS = {
  small: { width: 32, height: 32 },
  medium: { width: 48, height: 48 },
  large: { width: 64, height: 64 },
  xlarge: { width: 96, height: 96 },
};

export function BrandLogo({
  variant = 'horizontal',
  size = 'medium',
  className,
  onClick,
  priority = false,
}: BrandLogoProps) {
  const imagePath = `/transparent/${LOGO_VARIANTS[variant]}`;

  const isIcon = variant === 'icon';
  const dimensions = isIcon ? ICON_DIMENSIONS[size] : SIZE_DIMENSIONS[size];

  // Adjust dimensions for stacked variant (more square)
  const adjustedDimensions =
    variant === 'stacked'
      ? { ...dimensions, height: dimensions.width }
      : dimensions;

  return (
    <div
      className={cn(
        'brand-logo inline-block',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      <Image
        src={imagePath}
        alt="Agents-11 Logo"
        width={adjustedDimensions.width}
        height={adjustedDimensions.height}
        className="w-auto h-auto max-w-full object-contain"
        priority={priority}
      />
    </div>
  );
}

export default BrandLogo;
