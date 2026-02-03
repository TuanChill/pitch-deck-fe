'use client';

import type { PitchDeckStatus } from '@/constants/pitch-deck-status';
import { getStatusColor, getStatusLabel } from '@/constants/pitch-deck-status';
import { cn } from '@/utils';

export type PitchDeckDetailHeaderProps = {
  title: string;
  status: PitchDeckStatus;
  createdAt: string;
  updatedAt: string;
  className?: string;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const PitchDeckDetailHeader = ({
  title,
  status,
  createdAt,
  updatedAt,
  className
}: PitchDeckDetailHeaderProps) => {
  const statusColor = getStatusColor(status);
  const statusLabel = getStatusLabel(status);

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium shrink-0', statusColor)}>
          {statusLabel}
        </span>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <span>Created {formatDate(createdAt)}</span>
        {updatedAt !== createdAt && <span>Updated {formatDate(updatedAt)}</span>}
      </div>
    </div>
  );
};
