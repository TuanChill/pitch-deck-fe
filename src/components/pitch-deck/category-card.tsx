'use client';

import { getScoreBand } from '@/constants/score-bands';
import { VC_CATEGORY_CONFIG } from '@/constants/vc-framework';
import type { VCCategory } from '@/types/response/pitch-deck';
import { cn, formatPercentage, formatScore } from '@/utils';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

type CategoryCardProps = {
  category: VCCategory;
  score: number;
  weight: number;
  details?: string;
  isExpanded?: boolean;
  onToggle?: () => void;
  className?: string;
};

export const CategoryCard = ({
  category,
  score,
  weight,
  details,
  isExpanded = false,
  onToggle,
  className
}: CategoryCardProps) => {
  const config = VC_CATEGORY_CONFIG[category];
  const Icon = config.icon;
  const band = getScoreBand(score);
  const weightPercent = formatPercentage(weight);

  return (
    <motion.div
      layout
      className={cn(
        'border rounded-lg overflow-hidden transition-colors',
        isExpanded && 'ring-2 ring-primary/20',
        className
      )}
    >
      {/* Card header */}
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
              `bg-gradient-to-br ${config.gradientFrom} ${config.gradientTo}`
            )}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-semibold text-sm">{config.label}</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {weightPercent}%
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
          </div>

          {/* Score */}
          <div className="text-right shrink-0">
            <p className={cn('text-2xl font-bold tabular-nums', band.textColor)}>
              {formatScore(score)}
            </p>
            <p className="text-xs text-muted-foreground">{band.label}</p>
          </div>

          {/* Expand icon */}
          {onToggle && (
            <ChevronDown
              className={cn(
                'w-5 h-5 text-muted-foreground transition-transform shrink-0',
                isExpanded && 'transform rotate-180'
              )}
            />
          )}
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 0.6, ease: 'circOut' }}
            className={cn('h-full', band.bgColor)}
          />
        </div>
      </button>

      {/* Expanded details */}
      {isExpanded && details && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t bg-muted/30 p-4"
        >
          <p className="text-sm text-foreground">{details}</p>
        </motion.div>
      )}
    </motion.div>
  );
};
