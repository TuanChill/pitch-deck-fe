'use client';

import { APP_URL } from '@/constants/routes';
import { cn } from '@/utils';
import { ArrowRight, Share2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';

import { DeleteConfirmationDialog } from './delete-confirmation-dialog';

export type PitchDeckActionsProps = {
  uuid: string;
  status: string;
  title: string;
  isDeleting?: boolean;
  onDelete?: () => void;
  className?: string;
};

export const PitchDeckActions = ({
  uuid: _uuid,
  status,
  title,
  isDeleting = false,
  onDelete,
  className
}: PitchDeckActionsProps) => {
  const router = useRouter();
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

      {/* Analyze Button - links to analysis page if status is ready */}
      <Button
        type="button"
        variant="default"
        onClick={() => router.push(APP_URL.PITCH_DECK)}
        disabled={!canAnalyze}
      >
        Analyze Deck
        <ArrowRight className="w-4 h-4" />
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
