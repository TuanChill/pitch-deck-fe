'use client';

import { VC_CATEGORIES, VC_CATEGORY_CONFIG } from '@/constants/vc-framework';
import type { VCCategory, VCCategoryScore } from '@/types/response/pitch-deck';
import { cn } from '@/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { CategoryCard } from './category-card';

type SortOption = 'score' | 'weight' | 'name';
type SortOrder = 'asc' | 'desc';

type CategoryGridProps = {
  categoryScores: VCCategoryScore;
  className?: string;
};

export const CategoryGrid = ({ categoryScores, className }: CategoryGridProps) => {
  const [expandedCategory, setExpandedCategory] = useState<VCCategory | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('weight');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Sort categories
  const sortedCategories = [...VC_CATEGORIES].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'score':
        comparison = categoryScores[a].score - categoryScores[b].score;
        break;
      case 'weight':
        comparison = categoryScores[a].weight - categoryScores[b].weight;
        break;
      case 'name':
        comparison = VC_CATEGORY_CONFIG[a].label.localeCompare(VC_CATEGORY_CONFIG[b].label);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortOrder('desc');
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Sort controls */}
      <div className="flex gap-2">
        <Button
          variant={sortBy === 'score' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleSort('score')}
        >
          Score
          {sortBy === 'score' &&
            (sortOrder === 'asc' ? (
              <ArrowUp className="w-4 h-4 ml-1" />
            ) : (
              <ArrowDown className="w-4 h-4 ml-1" />
            ))}
        </Button>
        <Button
          variant={sortBy === 'weight' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleSort('weight')}
        >
          Weight
          {sortBy === 'weight' &&
            (sortOrder === 'asc' ? (
              <ArrowUp className="w-4 h-4 ml-1" />
            ) : (
              <ArrowDown className="w-4 h-4 ml-1" />
            ))}
        </Button>
        <Button
          variant={sortBy === 'name' ? 'default' : 'outline'}
          size="sm"
          onClick={() => toggleSort('name')}
        >
          Name
          {sortBy === 'name' &&
            (sortOrder === 'asc' ? (
              <ArrowUp className="w-4 h-4 ml-1" />
            ) : (
              <ArrowDown className="w-4 h-4 ml-1" />
            ))}
        </Button>
      </div>

      {/* Category cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedCategories.map((category) => {
          const { score, weight, details } = categoryScores[category];

          return (
            <CategoryCard
              key={category}
              category={category}
              score={score}
              weight={weight}
              details={details}
              isExpanded={expandedCategory === category}
              onToggle={() => setExpandedCategory(expandedCategory === category ? null : category)}
            />
          );
        })}
      </div>
    </div>
  );
};
