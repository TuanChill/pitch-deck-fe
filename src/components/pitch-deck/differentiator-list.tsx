'use client';

import { Differentiator } from '@/types/response/pitch-deck';
import { cn, formatScore } from '@/utils';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type DifferentiatorListProps = {
  differentiators: Differentiator[];
  className?: string;
};

export const DifferentiatorList = ({ differentiators, className }: DifferentiatorListProps) => {
  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold">Key Differentiators</h3>

      <div className="space-y-3">
        {differentiators.map((diff, index) => {
          const delta = diff.userScore - diff.competitorAvg;
          const isPositive = delta > 0;
          const isNeutral = delta === 0;

          return (
            <motion.div
              key={diff.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border rounded-lg p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-sm">{diff.aspect}</h4>
                <div className="flex items-center gap-1 text-xs">
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : isNeutral ? (
                    <Minus className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={cn(
                      'font-medium tabular-nums',
                      isPositive
                        ? 'text-green-600 dark:text-green-400'
                        : isNeutral
                          ? 'text-muted-foreground'
                          : 'text-red-600 dark:text-red-400'
                    )}
                  >
                    {isPositive ? '+' : ''}
                    {formatScore(delta)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground mb-3">{diff.description}</p>

              {/* Comparison bars */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">You</span>
                    <span className="font-medium">{formatScore(diff.userScore)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${diff.userScore}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Competitor Avg</span>
                    <span className="font-medium">{formatScore(diff.competitorAvg)}</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${diff.competitorAvg}%` }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="h-full bg-muted-foreground/40"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
