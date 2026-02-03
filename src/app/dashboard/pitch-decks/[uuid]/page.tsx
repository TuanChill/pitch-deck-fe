'use client';

import { APP_URL } from '@/constants/routes';
import { deletePitchDeckByUuid } from '@/services/api';
import { usePitchDeckManagementStore } from '@/stores';
import { ArrowLeft, FileX } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { AuthGuard } from '@/components/auth/auth-guard';
import { PitchDeckDetailHeader } from '@/components/pitch-deck-management';
import { PitchDeckInfo } from '@/components/pitch-deck-management';
import { PitchDeckActions } from '@/components/pitch-deck-management';
import { Button } from '@/components/ui/button';

// Loading skeleton component
const LoadingSkeleton = () => (
  <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
    <div className="space-y-2">
      <div className="h-8 w-48 bg-muted animate-pulse rounded" />
      <div className="h-6 w-64 bg-muted animate-pulse rounded" />
    </div>
    <div className="space-y-4">
      <div className="h-32 bg-muted animate-pulse rounded-lg" />
      <div className="h-24 bg-muted animate-pulse rounded-lg" />
    </div>
  </div>
);

// Not found component
const NotFoundState = ({ error }: { error?: string | null }) => (
  <div className="container max-w-4xl mx-auto py-16 px-4 text-center">
    <div className="flex justify-center mb-4">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
        <FileX className="w-8 h-8 text-muted-foreground" />
      </div>
    </div>
    <h2 className="text-2xl font-semibold mb-2">Pitch Deck Not Found</h2>
    <p className="text-muted-foreground mb-6">
      {error ||
        'The pitch deck you are looking for does not exist or you do not have access to it.'}
    </p>
    <Button variant="outline" onClick={() => window.history.back()}>
      <ArrowLeft className="w-4 h-4 mr-2" />
      Go Back
    </Button>
  </div>
);

// Breadcrumb component
const Breadcrumb = ({ title }: { title: string }) => (
  <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
    <button
      onClick={() => window.history.back()}
      className="hover:text-foreground transition-colors"
    >
      Pitch Decks
    </button>
    <span>/</span>
    <span className="text-foreground font-medium truncate max-w-[200px]">{title}</span>
  </nav>
);

// UUID v4 validation regex
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function PitchDeckDetailContent() {
  const params = useParams();
  const router = useRouter();
  const uuid = params.uuid as string;

  // Validate UUID format before using
  const isValidUuid = UUID_V4_REGEX.test(uuid);
  const [isDeleting, setIsDeleting] = useState(false);

  const { currentDeck, isLoading, error, fetchPitchDeckDetail, removePitchDeck } =
    usePitchDeckManagementStore();

  useEffect(() => {
    if (uuid && isValidUuid) {
      fetchPitchDeckDetail(uuid);
    }
  }, [uuid, isValidUuid, fetchPitchDeckDetail]);

  const handleDelete = async () => {
    if (!uuid || !isValidUuid || !currentDeck) return;

    setIsDeleting(true);
    try {
      // Optimistic remove from store
      removePitchDeck(uuid);

      // Call delete API
      await deletePitchDeckByUuid(uuid);

      toast.success('Pitch deck deleted successfully');

      // Navigate to list page
      router.push(APP_URL.PITCH_DECKS);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete pitch deck');
      // Re-fetch on error to restore state
      fetchPitchDeckDetail(uuid);
    } finally {
      setIsDeleting(false);
    }
  };

  // Invalid UUID state
  if (!isValidUuid) {
    return <NotFoundState error="Invalid pitch deck ID format" />;
  }

  // Loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Error or not found state
  if (error || !currentDeck) {
    return <NotFoundState error={error} />;
  }

  // Build file info for display
  const files = currentDeck
    ? [
        {
          originalFileName: currentDeck.originalFileName,
          fileSize: currentDeck.fileSize,
          mimeType: currentDeck.mimeType
        }
      ]
    : undefined;

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb title={currentDeck.title} />

      {/* Header with title, status, dates */}
      <PitchDeckDetailHeader
        title={currentDeck.title}
        status={currentDeck.status}
        createdAt={currentDeck.createdAt}
        updatedAt={currentDeck.updatedAt}
      />

      {/* Info section: description, tags, files */}
      <PitchDeckInfo
        description={currentDeck.description}
        tags={currentDeck.tags}
        files={files}
        status={currentDeck.status}
      />

      {/* Action buttons */}
      <div className="border-t pt-6">
        <PitchDeckActions
          uuid={uuid}
          status={currentDeck.status}
          title={currentDeck.title}
          isDeleting={isDeleting}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default function PitchDeckDetailPage() {
  return (
    <AuthGuard>
      <PitchDeckDetailContent />
    </AuthGuard>
  );
}
