'use client';

import { FILE_TYPE_LABELS } from '@/constants/file-types';
import type { AnalysisStage } from '@/stores';
import { cn } from '@/utils';
import { FileText, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { StageIndicator } from './stage-indicator';

type UploadProgressProps = {
  filename: string;
  fileType: string;
  progress?: number;
  state: AnalysisStage;
  onCancel?: () => void;
  className?: string;
};

export const UploadProgress = ({
  filename,
  fileType,
  progress = 0,
  state,
  onCancel,
  className
}: UploadProgressProps) => {
  const getLabel = () => {
    switch (state) {
      case 'uploading':
        return 'Uploading...';
      case 'analyzing':
        return 'Analyzing pitch deck...';
      case 'insights':
        return 'Generating insights...';
      case 'completed':
        return 'Complete';
    }
  };

  return (
    <div className={cn('border rounded-lg p-6 space-y-6', className)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
          <FileText className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{filename}</p>
          <p className="text-xs text-muted-foreground">
            {FILE_TYPE_LABELS[fileType] || fileType} • {getLabel()}
          </p>
        </div>
        {onCancel && state !== 'completed' && (
          <Button type="button" variant="ghost" size="icon" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <StageIndicator currentStage={state} progress={progress} />
    </div>
  );
};
