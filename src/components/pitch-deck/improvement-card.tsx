'use client';

import { SEVERITY_CONFIG } from '@/constants/indicators';
import { ImprovementItem } from '@/types/response/pitch-deck';
import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

type ImprovementCardProps = {
  improvement: ImprovementItem;
  className?: string;
};

export const ImprovementCard = ({ improvement, className }: ImprovementCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const severityConfig = SEVERITY_CONFIG[improvement.severity];

  return (
    <motion.div
      layout
      className={cn(
        'border rounded-lg overflow-hidden transition-colors',
        improvement.severity === 'high' && 'border-red-200 dark:border-red-800',
        improvement.severity === 'medium' && 'border-amber-200 dark:border-amber-800',
        improvement.severity === 'low' && 'border-gray-200 dark:border-gray-800',
        isExpanded && 'ring-2 ring-primary/20',
        className
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          {/* Priority indicator */}
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
              improvement.severity === 'high' && 'bg-red-100 dark:bg-red-900/30',
              improvement.severity === 'medium' && 'bg-amber-100 dark:bg-amber-900/30',
              improvement.severity === 'low' && 'bg-gray-100 dark:bg-gray-900/30'
            )}
          >
            <AlertTriangle
              className={cn(
                'w-5 h-5',
                improvement.severity === 'high' && 'text-red-600 dark:text-red-400',
                improvement.severity === 'medium' && 'text-amber-600 dark:text-amber-400',
                improvement.severity === 'low' && 'text-gray-600 dark:text-gray-400'
              )}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h4 className="font-semibold text-sm">{improvement.title}</h4>
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  severityConfig.bgColor,
                  severityConfig.color
                )}
              >
                {severityConfig.label}
              </span>
              <span
                className={cn('text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground')}
              >
                Priority #{improvement.priority}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{improvement.description}</p>
          </div>

          {/* Expand/collapse indicator */}
          <div className="shrink-0 pt-1">
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>
      </button>

      {/* Expanded recommendation */}
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t bg-muted/30 p-4"
        >
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <h5 className="text-sm font-semibold mb-1">Recommended Action</h5>
              <p className="text-sm text-foreground">{improvement.recommendation}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
