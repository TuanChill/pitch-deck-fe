'use client';

import type { AnalysisStage } from '@/stores';
import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';

type StageConfig = {
  id: AnalysisStage;
  label: string;
  description: string;
};

const STAGES: StageConfig[] = [
  { id: 'uploading', label: 'Uploading', description: 'Transferring your pitch deck' },
  { id: 'analyzing', label: 'Analyzing', description: 'Processing content with AI' },
  { id: 'insights', label: 'Generating Insights', description: 'Creating recommendations' },
  { id: 'completed', label: 'Complete', description: 'Analysis ready' }
];

type StageIndicatorProps = {
  currentStage: AnalysisStage;
  progress?: number;
  className?: string;
};

export const StageIndicator = ({ currentStage, progress = 0, className }: StageIndicatorProps) => {
  // Only show stages when in an active state
  const isActiveStage =
    currentStage === 'uploading' ||
    currentStage === 'analyzing' ||
    currentStage === 'insights' ||
    currentStage === 'completed';
  if (!isActiveStage) return null;

  const currentStageIndex = STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className={cn('w-full relative', className)}>
      <div className="flex items-center justify-between">
        {STAGES.map((stage, index) => {
          const isCompleted = index < currentStageIndex;
          const isCurrent = index === currentStageIndex;
          const isPending = index > currentStageIndex;

          return (
            <div key={stage.id} className="flex flex-col items-center flex-1">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className={cn(
                  'relative w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors',
                  isCompleted && 'bg-primary border-primary text-primary-foreground',
                  isCurrent && 'bg-primary/10 border-primary text-primary',
                  isPending && 'bg-muted border-muted-foreground/30 text-muted-foreground'
                )}
              >
                {isCompleted && <Check className="w-5 h-5" />}
                {isCurrent && <Loader2 className="w-5 h-5 animate-spin" />}
                {isPending && <span className="text-sm font-medium">{index + 1}</span>}

                {isCurrent && progress > 0 && (
                  <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-primary/20"
                    />
                    <motion.circle
                      cx="24"
                      cy="24"
                      r="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeDasharray={125.6}
                      strokeDashoffset={125.6 - (progress / 100) * 125.6}
                      className="text-primary"
                      strokeLinecap="round"
                      initial={{ strokeDashoffset: 125.6 }}
                      animate={{ strokeDashoffset: 125.6 - (progress / 100) * 125.6 }}
                    />
                  </svg>
                )}
              </motion.div>

              <div className="mt-3 text-center">
                <p
                  className={cn(
                    'text-sm font-medium',
                    isCompleted || isCurrent ? 'text-foreground' : 'text-muted-foreground'
                  )}
                >
                  {stage.label}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute top-6 left-0 right-0 flex px-16 pointer-events-none">
        {STAGES.slice(0, -1).map((_, index) => (
          <motion.div
            key={index}
            className="h-0.5 flex-1 mx-1 bg-muted"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: index < currentStageIndex ? 1 : 0 }}
            transition={{ delay: index * 0.1 }}
            style={{ originX: 0 }}
          />
        ))}
      </div>
    </div>
  );
};
