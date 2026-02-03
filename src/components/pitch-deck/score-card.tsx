'use client';

import { getScoreColor } from '@/constants/score-bands';
import { cn } from '@/utils';
import { getScoreGrade } from '@/utils/mock-analysis';

type ScoreCardProps = {
  score: number;
  label: string;
  size?: 'default' | 'large';
  showGrade?: boolean;
  className?: string;
};

export const ScoreCard = ({
  score,
  label,
  size = 'default',
  showGrade = true,
  className
}: ScoreCardProps) => {
  const sizeClasses = {
    default: 'w-24 h-24 text-2xl',
    large: 'w-32 h-32 text-4xl'
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div
        className={cn(
          'rounded-full border-4 flex items-center justify-center font-bold',
          sizeClasses[size],
          getScoreColor(score),
          score >= 80
            ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'
            : score >= 60
              ? 'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950'
              : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
        )}
      >
        {score}
      </div>
      <p className="text-sm font-medium mt-2">{label}</p>
      {showGrade && (
        <span
          className={cn(
            'text-xs font-semibold px-2 py-0.5 rounded-full mt-1',
            getScoreColor(score)
          )}
        >
          Grade: {getScoreGrade(score)}
        </span>
      )}
    </div>
  );
};
