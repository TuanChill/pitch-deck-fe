'use client';

import { useReportStore } from '@/stores/report-store';
import type { AnalysisResponse } from '@/types/response/pitch-deck';
import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { AlertCircle, FileX, RefreshCw, Upload } from 'lucide-react';
import { useEffect } from 'react';

import { AnalysisResult } from '@/components/pitch-deck/analysis-result';
import { GenerateReportButton, ReportDisplay } from '@/components/reports';
import { Button } from '@/components/ui/button';

import { RecommendationSection } from './recommendation-section';

type AnalyticsDisplayProps = {
  analysis: AnalysisResponse | null;
  isLoading: boolean;
  error?: string;
  onRetry?: () => void;
  onUpload?: () => void;
  deckUuid?: string;
  className?: string;
};

export const AnalyticsDisplay = ({
  analysis,
  isLoading,
  error,
  onRetry,
  onUpload,
  deckUuid,
  className
}: AnalyticsDisplayProps) => {
  const { loadReports, reports } = useReportStore();

  // Load existing reports when analysis changes
  useEffect(() => {
    if (analysis?.uuid && analysis.status === 'completed') {
      loadReports(analysis.uuid);
    }
  }, [analysis?.uuid, analysis?.status, loadReports]);

  const hasReports = analysis?.uuid && (reports[analysis.uuid]?.length ?? 0) > 0;
  // Loading state
  if (isLoading) {
    const progress = analysis?.progress ?? 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('border rounded-lg p-8 space-y-6', className)}
      >
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full"
          />
          <div>
            <h3 className="text-lg font-semibold">Analyzing Pitch Deck</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {analysis?.status === 'processing' ? 'Processing content...' : 'Please wait...'}
            </p>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('border border-destructive/50 rounded-lg p-8', className)}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-destructive">Analysis Failed</h3>
            <p className="text-sm text-muted-foreground mt-1">{error}</p>
          </div>
          {onRetry && (
            <Button type="button" variant="outline" onClick={onRetry} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry Analysis
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  // Empty state
  if (!analysis || analysis.status === 'pending') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('border border-dashed rounded-lg p-12', className)}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
            <FileX className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">No Analysis Yet</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Upload a pitch deck to get AI-powered insights and VC scoring.
            </p>
          </div>
          {onUpload && (
            <Button type="button" onClick={onUpload} className="gap-2">
              <Upload className="w-4 h-4" />
              Upload Pitch Deck
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  // Failed state (from analysis status)
  if (analysis.status === 'failed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('border border-destructive/50 rounded-lg p-8', className)}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-destructive">Analysis Failed</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {analysis.errorMessage || 'An error occurred during analysis.'}
            </p>
          </div>
          {onRetry && (
            <Button type="button" variant="outline" onClick={onRetry} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Retry Analysis
            </Button>
          )}
        </div>
      </motion.div>
    );
  }

  // Success state - completed analysis
  if (analysis.status === 'completed' && analysis.results) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('space-y-8', className)}
      >
        <AnalysisResult analysis={analysis} />

        {/* Report Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Analytics Report</h3>
            <GenerateReportButton analysisUuid={analysis.uuid} />
          </div>
          {hasReports && <ReportDisplay analysisUuid={analysis.uuid} />}
        </div>

        {/* Recommendation Section */}
        {deckUuid && (
          <div id="recommendation-section" className="space-y-4">
            <RecommendationSection deckUuid={deckUuid} />
          </div>
        )}
      </motion.div>
    );
  }

  // Processing state
  if (analysis.status === 'processing') {
    const progress = analysis.progress ?? 0;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn('border rounded-lg p-8 space-y-6', className)}
      >
        <div className="text-center space-y-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full"
          />
          <div>
            <h3 className="text-lg font-semibold">Analyzing Pitch Deck</h3>
            <p className="text-sm text-muted-foreground mt-1">Processing content with AI...</p>
          </div>
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
                className="h-full bg-primary"
              />
            </div>
            <p className="text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Fallback - should not reach here
  return null;
};
