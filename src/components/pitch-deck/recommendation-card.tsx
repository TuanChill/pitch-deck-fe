'use client';

import { cn } from '@/utils';
import { Lightbulb } from 'lucide-react';

type RecommendationCardProps = {
  recommendations: string[];
  className?: string;
};

export const RecommendationCard = ({ recommendations, className }: RecommendationCardProps) => {
  return (
    <div className={cn('border rounded-lg p-4 bg-primary/5', className)}>
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb className="w-5 h-5 text-primary" />
        <h3 className="font-semibold">Recommendations</h3>
      </div>
      <ul className="space-y-2">
        {recommendations.map((recommendation, index) => (
          <li key={index} className="text-sm flex gap-2">
            <span className="text-primary font-semibold">{index + 1}.</span>
            <span>{recommendation}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
