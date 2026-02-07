'use client';

import { cn } from '@/utils';
import { useState } from 'react';

import { DeleteConfirmationDialog } from './delete-confirmation-dialog';

export type PitchDeckActionsProps = {
  id: string;
  status: string;
  title: string;
  isAnalyzing?: boolean;
  onAnalyticsClick?: () => void;
  className?: string;
};

export const PitchDeckActions = ({
  id: _id,
  status,
  title,
  isAnalyzing: _isAnalyzing = false,
  onAnalyticsClick: _onAnalyticsClick,
  className
}: PitchDeckActionsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDeleteConfirm = () => {
    setIsDeleteDialogOpen(false);
  };

  // Reserved for future use
  void status;

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {/* Delete Button */}
      {/* Analytics Button - triggers analytics callback if status is ready */}
      {/* <Button
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
      </Button> */}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        deckTitle={title}
      />
    </div>
  );
};
