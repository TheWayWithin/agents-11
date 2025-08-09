'use client';

import { cn } from '@/lib/utils';

export interface StatusIndicatorProps {
  status: 'active' | 'inactive' | 'loading' | 'error' | 'success';
  size?: 'small' | 'medium' | 'large';
  label?: string;
  showLabel?: boolean;
  className?: string;
}

const STATUS_STYLES = {
  active: 'bg-status-active animate-pulse-glow',
  inactive: 'bg-status-inactive',
  loading: 'bg-status-loading animate-pulse',
  error: 'bg-status-error',
  success: 'bg-status-success',
};

const SIZE_STYLES = {
  small: 'w-2 h-2',
  medium: 'w-3 h-3',
  large: 'w-4 h-4',
};

const STATUS_LABELS = {
  active: 'Active',
  inactive: 'Inactive',
  loading: 'Loading',
  error: 'Error',
  success: 'Success',
};

export function StatusIndicator({
  status,
  size = 'medium',
  label,
  showLabel = false,
  className,
}: StatusIndicatorProps) {
  const displayLabel = label || STATUS_LABELS[status];

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div
        className={cn('rounded-full', STATUS_STYLES[status], SIZE_STYLES[size])}
      />
      {showLabel && (
        <span className="text-sm text-muted-foreground">{displayLabel}</span>
      )}
    </div>
  );
}

export default StatusIndicator;
