'use client';

import type { PitchDeckStatus } from '@/constants/pitch-deck-status';
import { APP_URL } from '@/constants/routes';
import { deletePitchDeckByUuid } from '@/services/api';
import { usePitchDeckManagementStore } from '@/stores';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

import {
  PitchDeckFilter,
  PitchDeckList,
  PitchDeckPagination,
  DeleteConfirmationDialog
} from '@/components/pitch-deck-management';
import { Button } from '@/components/ui/button';

export default function PitchDecksPage() {
  const router = useRouter();
  const {
    pitchDecks,
    total,
    limit,
    offset,
    filters,
    isLoading,
    error,
    fetchPitchDecks,
    removePitchDeck,
    setFilters,
    setPagination
  } = usePitchDeckManagementStore();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<{ uuid: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch pitch decks on mount and when filters/pagination change
  useEffect(() => {
    fetchPitchDecks();
  }, [fetchPitchDecks, offset, filters.status]);

  const handleStatusChange = useCallback(
    (status: PitchDeckStatus | 'all') => {
      setPagination(0);
      setFilters({ status: status === 'all' ? undefined : status });
    },
    [setFilters, setPagination]
  );

  const handlePageChange = useCallback(
    (newOffset: number) => {
      setPagination(newOffset);
    },
    [setPagination]
  );

  const handleDeleteClick = useCallback(
    (id: string) => {
      const deck = pitchDecks?.find((d) => d.id === id);
      if (deck) {
        setDeckToDelete({ uuid: deck.id, title: deck.title });
        setDeleteDialogOpen(true);
      }
    },
    [pitchDecks]
  );

  const handleDeleteConfirm = useCallback(async () => {
    if (!deckToDelete) return;

    setIsDeleting(true);
    removePitchDeck(deckToDelete.uuid);

    try {
      await deletePitchDeckByUuid(deckToDelete.uuid);
      toast.success('Pitch deck deleted successfully');
      setDeleteDialogOpen(false);
      setDeckToDelete(null);
    } catch {
      toast.error('Failed to delete pitch deck');
      fetchPitchDecks();
    } finally {
      setIsDeleting(false);
    }
  }, [deckToDelete, removePitchDeck, fetchPitchDecks]);

  const handleCardClick = useCallback(
    (id: string) => {
      router.push(APP_URL.PITCH_DECK_DETAIL(id));
    },
    [router]
  );

  const handleCreateNew = useCallback(() => {
    router.push(APP_URL.PITCH_DECK_UPLOAD);
  }, [router]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Pitch Decks</h1>
          <p className="text-muted-foreground mt-1">Manage and analyze your pitch decks</p>
        </div>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="h-4 w-4" />
          New Deck
        </Button>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Filter */}
      <div className="mb-6">
        <PitchDeckFilter
          selectedStatus={filters.status || 'all'}
          onStatusChange={handleStatusChange}
          totalCount={total}
        />
      </div>

      {/* List */}
      <PitchDeckList
        decks={pitchDecks}
        isLoading={isLoading}
        onDelete={handleDeleteClick}
        onClick={handleCardClick}
        onCreateNew={handleCreateNew}
      />

      {/* Pagination */}
      {!isLoading && pitchDecks && pitchDecks.length > 0 && (
        <div className="mt-8">
          <PitchDeckPagination
            total={total}
            limit={limit}
            offset={offset}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deckToDelete && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDeleteConfirm}
          deckTitle={deckToDelete.title}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
