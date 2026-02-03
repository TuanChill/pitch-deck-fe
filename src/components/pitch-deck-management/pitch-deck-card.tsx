import { PITCH_DECK_STATUS } from '@/constants/pitch-deck-status';
import type { PitchDeckListItem } from '@/types/response/pitch-deck';
import { cn } from '@/utils';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

interface PitchDeckCardProps {
  deck: PitchDeckListItem;
  onDelete: (uuid: string) => void;
  onClick?: (uuid: string) => void;
}

const STATUS_COLORS = {
  uploading: PITCH_DECK_STATUS.uploading.color,
  processing: PITCH_DECK_STATUS.processing.color,
  ready: PITCH_DECK_STATUS.ready.color,
  error: PITCH_DECK_STATUS.error.color
};

export const PitchDeckCard = ({ deck, onDelete, onClick }: PitchDeckCardProps) => {
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(deck.uuid);
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(deck.uuid);
    }
  };

  const statusColor = STATUS_COLORS[deck.status] || STATUS_COLORS.ready;
  const statusLabel = PITCH_DECK_STATUS[deck.status]?.label || deck.status;
  const createdDate = new Date(deck.createdAt);
  const timeAgo = isNaN(createdDate.getTime())
    ? 'Invalid date'
    : formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base text-card-foreground truncate">{deck.title}</h3>
          {deck.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{deck.description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDeleteClick}
          className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Delete pitch deck"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'inline-flex items-center rounded-full px-2 py-0.5 font-medium',
              statusColor
            )}
          >
            {statusLabel}
          </span>
          <span>
            {deck.chunkCount} {deck.chunkCount === 1 ? 'file' : 'files'}
          </span>
        </div>
        <span>{timeAgo}</span>
      </div>

      {deck.errorMessage && (
        <p className="text-xs text-destructive mt-2 truncate">{deck.errorMessage}</p>
      )}
    </div>
  );
};
