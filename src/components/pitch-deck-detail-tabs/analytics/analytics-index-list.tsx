/**
 * Analytics Index List
 * Table of contents for analytics tab with smooth scroll
 * Notion-style vertical list layout
 */

import { ChevronRight } from 'lucide-react';
import { memo } from 'react';

import { cn } from '@/lib/utils';

interface IndexItem {
  id: string;
  label: string;
}

interface AnalyticsIndexListProps {
  items: IndexItem[];
}

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const AnalyticsIndexList = memo(function AnalyticsIndexList({
  items
}: AnalyticsIndexListProps) {
  if (items.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border bg-card">
      <div className="p-3">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
          Contents
        </h3>
        <div className="space-y-0.5">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2',
                'text-sm text-left text-muted-foreground hover:text-foreground',
                'hover:bg-muted/50 rounded-md',
                'transition-all duration-150',
                'group'
              )}
            >
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
