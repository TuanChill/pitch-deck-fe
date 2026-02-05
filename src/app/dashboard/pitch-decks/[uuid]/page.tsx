'use client';

import { APP_URL } from '@/constants/routes';
import {
  deletePitchDeckByUuid,
  getAnalysisByDeck,
  pollAnalysisComplete,
  startAnalysis
} from '@/services/api';
import { usePitchDeckManagementStore } from '@/stores';
import type { AnalysisResponse } from '@/types/response/pitch-deck';
import { ArrowLeft, FileX } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { AuthGuard } from '@/components/auth/auth-guard';
import { AnalyticsDisplay } from '@/components/pitch-deck-analytics';
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

// UUID v4 validation regex
const UUID_V4_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function PitchDeckDetailContent() {
  const params = useParams();
  const router = useRouter();
  const uuid = params.uuid as string;

  // Validate UUID format before using
  const isValidUuid = UUID_V4_REGEX.test(uuid);
  const [isDeleting, setIsDeleting] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isAnalysisLoading, setIsAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const analyticsSectionRef = useRef<HTMLDivElement>(null);

  const { currentDeck, isLoading, error, fetchPitchDeckDetail, removePitchDeck } =
    usePitchDeckManagementStore();

  useEffect(() => {
    if (uuid && isValidUuid) {
      fetchPitchDeckDetail(uuid);
    }
  }, [uuid, isValidUuid, fetchPitchDeckDetail]);

  // Fetch analysis after pitch deck data is loaded successfully
  useEffect(() => {
    if (currentDeck && uuid && isValidUuid) {
      const loadAnalysis = async () => {
        try {
          const result = await getAnalysisByDeck(uuid);
          setAnalysis(result);
          setAnalysisError(null);
        } catch (err) {
          // Don't show error if analysis simply doesn't exist
          if (err instanceof Error && !err.message.includes('404')) {
            setAnalysisError(err.message);
          }
        }
      };
      loadAnalysis();
    }
  }, [currentDeck, uuid, isValidUuid]);

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

  const handleAnalyticsClick = async () => {
    if (!uuid || !isValidUuid) return;

    // If analysis exists and is completed, scroll to analytics section
    if (analysis?.status === 'completed') {
      analyticsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      return;
    }

    // Start new analysis with polling
    setIsAnalysisLoading(true);
    setAnalysisError(null);

    try {
      const startedAnalysis = await startAnalysis(uuid);

      // Update state with initial analysis data
      setAnalysis(startedAnalysis);

      // Poll until complete with progress updates
      const result = await pollAnalysisComplete(startedAnalysis.uuid, {
        onProgress: (progress) => {
          setAnalysis((prev) => (prev ? { ...prev, progress, status: 'processing' } : null));
        }
      });

      setAnalysis(result);
      toast.success('Analysis completed successfully');

      // Scroll to analytics section after completion
      analyticsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to analyze pitch deck';
      setAnalysisError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsAnalysisLoading(false);
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

  // Build file info for display from files array
  const files = currentDeck?.files?.map((file) => ({
    originalFileName: file.originalFileName,
    fileSize: file.fileSize,
    mimeType: file.mimeType
  }));

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
          isAnalyzing={isAnalysisLoading}
          onDelete={handleDelete}
          onAnalyticsClick={handleAnalyticsClick}
        />
      </div>

      {/* Analytics section */}
      <div ref={analyticsSectionRef} className="border-t pt-6">
        <AnalyticsDisplay
          analysis={analysis}
          isLoading={isAnalysisLoading}
          error={analysisError ?? undefined}
          onRetry={handleAnalyticsClick}
          deckUuid={uuid}
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
