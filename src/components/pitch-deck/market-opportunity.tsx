'use client';

import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type MarketOpportunityProps = {
  size: string;
  growth: string;
  trend: 'rising' | 'stable' | 'declining';
  className?: string;
};

export const MarketOpportunity = ({ size, growth, trend, className }: MarketOpportunityProps) => {
  const trendConfig = {
    rising: { icon: TrendingUp, color: 'text-green-500', label: 'Growing' },
    stable: { icon: Minus, color: 'text-blue-500', label: 'Stable' },
    declining: { icon: TrendingDown, color: 'text-red-500', label: 'Declining' }
  };

  const config = trendConfig[trend];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        'border rounded-lg p-4 bg-gradient-to-br from-primary/5 to-primary/10',
        className
      )}
    >
      <h3 className="text-lg font-semibold mb-4">Market Opportunity</h3>

      <div className="grid grid-cols-3 gap-4">
        {/* Market size */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-2xl font-bold">{size}</p>
          <p className="text-xs text-muted-foreground mt-1">Market Size</p>
        </motion.div>

        {/* Growth rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <p className="text-2xl font-bold text-primary">{growth}</p>
          <p className="text-xs text-muted-foreground mt-1">CAGR</p>
        </motion.div>

        {/* Trend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <Icon className={cn('w-8 h-8 mx-auto', config.color)} />
          <p className={cn('text-xs font-medium mt-1', config.color)}>{config.label}</p>
        </motion.div>
      </div>
    </div>
  );
};
