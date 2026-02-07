import { PIPELINE_STAGE_ORDER } from '@/constants/pipeline-stages';
import { usePipelineStore } from '@/stores/pipeline.store';
import { AlertCircle, CheckCircle2, ChevronDown, Clock, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const STATUS_ICONS = {
  pending: Clock,
  running: Loader2,
  completed: CheckCircle2,
  failed: AlertCircle
} as const;

const STATUS_COLORS = {
  pending: 'bg-gray-50 text-gray-600 border-gray-300',
  running: 'bg-blue-50 text-blue-600 border-blue-400',
  completed: 'bg-green-50 text-green-600 border-green-400',
  failed: 'bg-red-50 text-red-600 border-red-400'
} as const;

const LINE_COLORS = {
  pending: 'bg-gray-300',
  running: 'bg-blue-400',
  completed: 'bg-green-400'
} as const;

export function PipelineCards() {
  const stages = usePipelineStore((s) => s.stages);

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <div className="flex flex-col items-center gap-3">
        {PIPELINE_STAGE_ORDER.map((stageId, index) => {
          const stage = stages[stageId];
          const StatusIcon = STATUS_ICONS[stage.status];
          const isLast = index === PIPELINE_STAGE_ORDER.length - 1;

          // Determine line color based on whether this stage is completed
          const nextStage = stages[PIPELINE_STAGE_ORDER[index + 1]];
          const nextLineColor =
            nextStage?.status === 'running' || nextStage?.status === 'completed'
              ? LINE_COLORS.completed
              : LINE_COLORS.pending;

          return (
            <div key={stageId} className="flex flex-col items-center w-full">
              {/* Stage Card */}
              <div
                className={cn(
                  'min-w-[180px] w-[220px] rounded-lg border-2 p-3 transition-all',
                  STATUS_COLORS[stage.status]
                )}
              >
                {/* Icon and name */}
                <div className="flex items-center gap-2 mb-2">
                  <StatusIcon
                    className={cn(
                      'w-4 h-4 flex-shrink-0',
                      stage.status === 'running' && 'animate-spin'
                    )}
                  />
                  <span className="font-semibold text-xs">{stage.name}</span>
                </div>

                {/* Status text */}
                <div className="text-xs font-medium mt-1">
                  {stage.status === 'pending' && 'Waiting'}
                  {stage.status === 'running' && 'Generating content'}
                  {stage.status === 'completed' && 'Done'}
                  {stage.status === 'failed' && 'Failed'}
                </div>
              </div>

              {/* Connecting Line/Arrow */}
              {!isLast && (
                <div className="flex flex-col items-center py-1">
                  <div
                    className={cn(
                      'w-0.5 h-6 rounded transition-colors duration-300',
                      nextLineColor
                    )}
                  />
                  <ChevronDown className={cn('w-4 h-4', nextLineColor.replace('bg-', 'text-'))} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
