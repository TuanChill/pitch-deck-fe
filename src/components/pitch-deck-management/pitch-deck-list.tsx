import type { PitchDeckListItem } from '@/types/response/pitch-deck';
import { FileText, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { PitchDeckCard } from './pitch-deck-card';

interface PitchDeckListProps {
  decks: PitchDeckListItem[] | undefined;
  isLoading: boolean;
  onDelete: (uuid: string) => void;
  onClick?: (uuid: string) => void;
  onCreateNew?: () => void;
}

const CardSkeleton = () => (
  <div className="flex flex-col rounded-lg border bg-card p-4 shadow-sm animate-pulse">
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className="flex-1 min-w-0">
        <div className="h-5 bg-muted rounded w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
      <div className="h-8 w-8 bg-muted rounded" />
    </div>
    <div className="flex items-center justify-between mt-auto">
      <div className="flex items-center gap-3">
        <div className="h-5 bg-muted rounded-full w-16" />
        <div className="h-4 bg-muted rounded w-12" />
      </div>
      <div className="h-4 bg-muted rounded w-16" />
    </div>
  </div>
);

const EmptyState = ({ onCreateNew }: { onCreateNew?: () => void }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
      <FileText className="h-8 w-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">No pitch decks yet</h3>
    <p className="text-sm text-muted-foreground mb-6 max-w-md">
      Create your first pitch deck to get started with AI-powered analysis and insights.
    </p>
    {onCreateNew && (
      <Button onClick={onCreateNew} className="gap-2">
        <Plus className="h-4 w-4" />
        Create Your First Deck
      </Button>
    )}
  </div>
);

export const PitchDeckList = ({
  decks,
  isLoading,
  onDelete,
  onClick,
  onCreateNew
}: PitchDeckListProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!decks || decks.length === 0) {
    return <EmptyState onCreateNew={onCreateNew} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {decks.map((deck) => (
        <PitchDeckCard key={deck.id} deck={deck} onDelete={onDelete} onClick={onClick} />
      ))}
    </div>
  );
};
