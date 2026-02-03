'use client';

import { StrengthItem } from '@/types/response/pitch-deck';
import { cn } from '@/utils';
import { TrendingUp } from 'lucide-react';

import { StaggerChildren } from '@/components/ui/animated';

import { StrengthCard } from './strength-card';

type StrengthListProps = {
  strengths: StrengthItem[];
  className?: string;
};

export const StrengthList = ({ strengths, className }: StrengthListProps) => {
  if (strengths.length === 0) {
    return (
      <div className={cn('text-center py-8 text-muted-foreground', className)}>
        <TrendingUp className="w-12 h-12 mx-auto mb-2 opacity-50" />
        <p>No strengths identified</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-green-500" />
        Key Strengths ({strengths.length})
      </h3>
      <StaggerChildren className="space-y-3">
        {strengths.map((strength) => (
          <StrengthCard key={strength.id} strength={strength} />
        ))}
      </StaggerChildren>
    </div>
  );
};
