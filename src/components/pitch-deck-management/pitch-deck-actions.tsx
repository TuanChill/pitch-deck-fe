'use client';

import { cn } from '@/utils';
import { ArrowRight, Loader2, Share2, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { DeleteConfirmationDialog } from './delete-confirmation-dialog';

export type PitchDeckActionsProps = {
  uuid: string;
  status: string;
  title: string;
  isDeleting?: boolean;
  isAnalyzing?: boolean;
  onDelete?: () => void;
  onAnalyticsClick?: () => void;
  className?: string;
};

export const PitchDeckActions = ({
  uuid: _uuid,
  status,
  title,
  isDeleting = false,
  isAnalyzing = false,
  onDelete,
  onAnalyticsClick,
  className
}: PitchDeckActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = () => {
    setIsDeleteDialogOpen(false);
    onDelete?.();
  };

  const canAnalyze = status === 'ready';

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {/* Delete Button */}
      <Button
        type="button"
        variant="destructive"
        onClick={() => setIsDeleteDialogOpen(true)}
        disabled={isDeleting}
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </Button>

      {/* Share Button (disabled placeholder) */}
      <Button type="button" variant="outline" disabled>
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      {/* Analytics Button - triggers analytics callback if status is ready */}
      <Button
        type="button"
        variant="default"
        onClick={onAnalyticsClick}
        disabled={!canAnalyze || isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Analyzing...
          </>
        ) : (
          <>
            Analytics
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </Button>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        deckTitle={title}
        isDeleting={isDeleting}
      />
    </div>
  );
};
