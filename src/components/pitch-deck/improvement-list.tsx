'use client';

import { ImprovementItem } from '@/types/response/pitch-deck';
import { cn } from '@/utils';
import { AlertTriangle } from 'lucide-react';

import { StaggerChildren } from '@/components/ui/animated';

import { ImprovementCard } from './improvement-card';

type ImprovementListProps = {
  improvements: ImprovementItem[];
  className?: string;
};

export const ImprovementList = ({ improvements, className }: ImprovementListProps) => {
  if (improvements.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No areas for improvement</p>
      </div>
    );
  }

  // Sort by priority
  const sorted = [...improvements].sort((a, b) => a.priority - b.priority);

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        Areas for Improvement ({sorted.length})
      </h3>
      <StaggerChildren className="space-y-3">
        {sorted.map((improvement) => (
          <ImprovementCard key={improvement.id} improvement={improvement} />
        ))}
      </StaggerChildren>
    </div>
  );
};
