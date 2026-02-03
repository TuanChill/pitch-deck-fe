'use client';

import type { VCCategory } from '@/types/response/pitch-deck';
import { cn } from '@/utils';

// Category color mapping for Tailwind JIT compatibility
const CATEGORY_COLORS: Record<VCCategory, string> = {
  teamAndFounders: 'text-blue-500',
  marketSize: 'text-purple-500',
  productSolution: 'text-green-500',
  traction: 'text-orange-500',
  businessModel: 'text-cyan-500',
  competition: 'text-pink-500',
  financials: 'text-amber-500'
};

type CategoryExpansionProps = {
  category: VCCategory;
  insights?: string[];
  recommendations?: string[];
  className?: string;
};

export const CategoryExpansion = ({
  category,
  insights = [],
  recommendations = [],
  className
}: CategoryExpansionProps) => {
  const bulletColor = CATEGORY_COLORS[category];

  return (
    <div className={cn('p-4 space-y-4', className)}>
      {/* Insights section */}
      {insights.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Key Insights</h4>
          <ul className="space-y-1">
            {insights.map((insight, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className={bulletColor}>•</span>
                {insight}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations section */}
      {recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Recommendations</h4>
          <ul className="space-y-1">
            {recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary">→</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
