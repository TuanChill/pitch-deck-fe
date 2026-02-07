'use client';

import { APP_URL } from '@/constants/routes';
import { usePipelineAutoStart } from '@/hooks/use-pipeline-auto-start';
import { usePitchDeckManagementStore } from '@/stores';
import { ArrowLeft, FileX } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

import { PipelineCards } from '@/components/pipeline-visualization';
import { PitchDeckTabs } from '@/components/pitch-deck-detail-tabs';
import {
  PitchDeckActions,
  PitchDeckDetailHeader,
  PitchDeckInfo
} from '@/components/pitch-deck-management';
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
const NotFoundState = ({ error }: { error?: string | null }) => {
  const router = useRouter();

  return (
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
      <Button variant="outline" onClick={() => router.push(APP_URL.PITCH_DECKS)}>
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Pitch Decks
      </Button>
    </div>
  );
};

// Breadcrumb component
const Breadcrumb = ({ title }: { title: string }) => (
  <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
    <Link href={APP_URL.PITCH_DECKS} className="hover:text-foreground transition-colors">
      Pitch Decks
    </Link>
    <span>/</span>
    <span className="text-foreground font-medium truncate max-w-[200px]">{title}</span>
  </nav>
);

// MongoDB ObjectId validation regex (24 hex characters)
const MONGO_ID_REGEX = /^[0-9a-f]{24}$/i;

function PitchDeckDetailContent() {
  const params = useParams();
  const id = params.id as string;

  // Validate ID format before using
  const isValidId = MONGO_ID_REGEX.test(id);

  // Get currentDeck from store BEFORE using it in pipeline hook
  const { currentDeck, isLoading, error, fetchPitchDeckDetail } = usePitchDeckManagementStore();

  // NEW: Pipeline auto-start hook
  const { isPolling: isPipelinePolling, overallStatus } = usePipelineAutoStart(id, {
    autoStart: true,
    currentStep: currentDeck?.currentStep,
    onProgress: () => {
      // Progress updates handled by store
    },
    onComplete: () => {
      toast.success('Analysis completed successfully');
    },
    onError: (error) => {
      toast.error(error);
    },
    onDeckUpdate: () => {
      // Refresh deck data when currentStep changes during polling
      fetchPitchDeckDetail(id);
    }
  });

  useEffect(() => {
    if (id && isValidId) {
      fetchPitchDeckDetail(id);
    }
  }, [id, isValidId, fetchPitchDeckDetail]);

  // Invalid UUID state
  if (!isValidId) {
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

  // Build file info for display from files array
  const files = currentDeck?.files?.map((file) => ({
    originalFileName: file.originalFileName,
    fileSize: file.fileSize,
    mimeType: file.mimeType
  }));

  return (
    <div className="container max-w-6xl mx-auto py-8 px-4 space-y-8">
      {/* Breadcrumb */}
      <Breadcrumb title={currentDeck.title} />

      {/* Header with title, status, dates */}
      <PitchDeckDetailHeader title={currentDeck.title} status={currentDeck.status} />

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
          id={id}
          status={currentDeck.status}
          title={currentDeck.title}
          isAnalyzing={isPipelinePolling}
          onAnalyticsClick={() => {
            // Reserved for manual re-trigger
            toast.info('Analysis already running');
          }}
        />
      </div>

      {/* Pipeline visualization - hide when done */}
      {currentDeck.currentStep !== 'done' && (
        <div className="border-t pt-6">
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Analysis Pipeline</h3>
            <div className="rounded-lg border bg-card p-4 overflow-x-auto">
              <PipelineCards />
            </div>
          </div>
        </div>
      )}

      {/* Tabs section - show when pipeline completes or currentStep is done */}
      {(overallStatus === 'completed' || currentDeck.currentStep === 'done') && (
        <div className="border-t pt-6">
          <PitchDeckTabs deckId={id} />
        </div>
      )}

      {/* Analytics section */}
      {/* <div className="border-t pt-6">
        <AnalyticsDisplay
          analysis={analysis}
          isLoading={isPipelinePolling}
          error={pipelineError ?? undefined}
          onRetry={() => {
            // Reserved for manual retry
            usePipelineStore.getState().reset();
            window.location.reload();
          }}
          deckUuid={id}
        />
      </div> */}
    </div>
  );
}

export default function PitchDeckDetailPage() {
  return <PitchDeckDetailContent />;
}
