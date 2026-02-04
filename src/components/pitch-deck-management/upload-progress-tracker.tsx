'use client';

import { cn } from '@/utils';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export type UploadState = 'idle' | 'uploading' | 'processing' | 'success' | 'error';

export type UploadProgressTrackerProps = {
  filename: string;
  progress: number;
  state: UploadState;
  error?: string;
  className?: string;
};

const STATE_CONFIG = {
  idle: {
    icon: CheckCircle2,
    iconClass: 'text-muted-foreground',
    bgClass: 'bg-muted',
    progressClass: 'bg-muted',
    getText: () => ''
  },
  uploading: {
    icon: Loader2,
    iconClass: 'animate-spin text-primary',
    bgClass: 'bg-primary/10',
    progressClass: 'bg-primary',
    getText: (progress: number) => `Uploading... ${progress}%`
  },
  processing: {
    icon: Loader2,
    iconClass: 'animate-spin text-primary',
    bgClass: 'bg-primary/10',
    progressClass: 'bg-primary',
    getText: () => 'Processing pitch deck...'
  },
  success: {
    icon: CheckCircle2,
    iconClass: 'text-green-600 dark:text-green-500',
    bgClass: 'bg-green-100 dark:bg-green-900/30',
    progressClass: 'bg-green-600 dark:bg-green-500',
    getText: () => 'Upload complete!'
  },
  error: {
    icon: AlertCircle,
    iconClass: 'text-destructive',
    bgClass: 'bg-destructive/10',
    progressClass: 'bg-destructive',
    getText: () => 'Upload failed'
  }
} as const;

export const UploadProgressTracker = ({
  filename,
  progress,
  state,
  error,
  className
}: UploadProgressTrackerProps) => {
  const config = STATE_CONFIG[state];
  const Icon = config.icon;

  return (
    <div className={cn('space-y-4', className)}>
      {/* File Info Card */}
      <div className={cn('flex items-center gap-3 p-4 rounded-lg border', config.bgClass)}>
        <Icon className={cn('w-5 h-5 shrink-0', config.iconClass)} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{filename}</p>
          <p className="text-xs text-muted-foreground">{config.getText(progress)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      {(state === 'uploading' || state === 'processing') && (
        <div className="space-y-2">
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all duration-300 ease-out', config.progressClass)}
              style={{ width: `${state === 'processing' ? 100 : progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{state === 'uploading' ? `${progress}%` : 'Processing...'}</span>
          </div>
        </div>
      )}

      {/* Success State */}
      {state === 'success' && (
        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
          <div className={cn('h-full', config.progressClass)} style={{ width: '100%' }} />
        </div>
      )}

      {/* Error Message */}
      {state === 'error' && error && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}
    </div>
  );
};

// Helper component for success state with navigation options
export type UploadSuccessActionsProps = {
  onViewDeck: () => void;
  onUploadAnother: () => void;
  onBackToList: () => void;
  className?: string;
};

export const UploadSuccessActions = ({
  onViewDeck,
  onUploadAnother,
  onBackToList,
  className
}: UploadSuccessActionsProps) => {
  return (
    <div className={cn('space-y-4 pt-4 border-t', className)}>
      <div className="text-center">
        <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-green-600 dark:text-green-500" />
        <h3 className="text-lg font-semibold mb-1">Upload Complete!</h3>
        <p className="text-sm text-muted-foreground">
          Your pitch deck has been uploaded successfully.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onViewDeck}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md',
            'bg-primary text-primary-foreground',
            'hover:bg-primary/90',
            'transition-colors'
          )}
        >
          View Deck
        </button>
        <button
          onClick={onUploadAnother}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md',
            'bg-secondary text-secondary-foreground',
            'hover:bg-secondary/80',
            'transition-colors'
          )}
        >
          Upload Another
        </button>
        <button
          onClick={onBackToList}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md',
            'border border-input bg-background',
            'hover:bg-accent hover:text-accent-foreground',
            'transition-colors'
          )}
        >
          Back to List
        </button>
      </div>
    </div>
  );
};
