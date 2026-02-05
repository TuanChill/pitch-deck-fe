'use client';

import { IMPACT_CONFIG } from '@/constants/indicators';
import { VC_CATEGORY_CONFIG } from '@/constants/vc-framework';
import { StrengthItem } from '@/types/response/pitch-deck';
import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Quote } from 'lucide-react';
import { useState } from 'react';

type StrengthCardProps = {
  strength: StrengthItem;
  className?: string;
};

export const StrengthCard = ({ strength, className }: StrengthCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const categoryConfig = VC_CATEGORY_CONFIG[strength.category];
  const Icon = categoryConfig.icon;
  const impactConfig = IMPACT_CONFIG[strength.impact];

  return (
    <motion.div
      layout
      className={cn(
        'border rounded-lg overflow-hidden transition-colors',
        isExpanded && 'ring-2 ring-green-500/20',
        className
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          {/* Category icon */}
          <div
            className={cn(
              'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
              `bg-gradient-to-br ${categoryConfig.gradientFrom} ${categoryConfig.gradientTo}`
            )}
          >
            <Icon className="w-5 h-5 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{strength.title}</h4>
              <span
                className={cn(
                  'text-xs px-2 py-0.5 rounded-full',
                  impactConfig.bgColor,
                  impactConfig.color
                )}
              >
                {impactConfig.icon} {impactConfig.label}
              </span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{strength.description}</p>
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

        {/* Evidence count indicator */}
        {strength.evidence.length > 0 && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <Quote className="w-3 h-3" />
            <span>
              {strength.evidence.length} evidence source{strength.evidence.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </button>

      {/* Expanded evidence */}
      {isExpanded && strength.evidence.length > 0 && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t bg-muted/30 p-4 space-y-2"
        >
          {strength.evidence.map((quote, i) => (
            <div
              key={i}
              className={cn('p-3 rounded-lg border-l-4', `border-${categoryConfig.color}-500`)}
            >
              <p className="text-sm italic text-foreground">&ldquo;{quote.text}&rdquo;</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-muted-foreground">{categoryConfig.label}</span>
                {quote.slide && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">Slide {quote.slide}</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};
