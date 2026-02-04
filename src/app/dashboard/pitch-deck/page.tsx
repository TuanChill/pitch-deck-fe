'use client';

import { uploadPitchDeck, analyzePitchDeck } from '@/services/api';
import { usePitchDeckStore, AnalysisStage } from '@/stores';
import { useCallback, useState, useEffect } from 'react';
import { toast } from 'sonner';

import { FileUploader } from '@/components/pitch-deck';
import { UploadProgress } from '@/components/pitch-deck';
import { AnalysisResult } from '@/components/pitch-deck';

export default function PitchDeckPage() {
  const {
    uploadState,
    currentStage,
    currentUpload,
    currentAnalysis,
    error,
    setCurrentStage,
    reset
  } = usePitchDeckStore();

  const [progress, setProgress] = useState(0);

  // Auto-progress through stages during analysis
  useEffect(() => {
    if (uploadState === 'analyzing') {
      // Simulate stage transitions
      const stages: AnalysisStage[] = ['analyzing', 'insights'];
      let stageIndex = 0;

      const interval = setInterval(() => {
        if (stageIndex < stages.length) {
          setCurrentStage(stages[stageIndex]);
          stageIndex++;
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [uploadState, setCurrentStage]);

  const handleFileSelect = useCallback(
    async (file: File) => {
      try {
        reset();
        setCurrentStage('uploading');
        usePitchDeckStore.getState().setUploadState('uploading');

        // Upload with progress simulation
        let uploadProgress = 0;
        const progressInterval = setInterval(() => {
          uploadProgress += 10;
          setProgress(Math.min(uploadProgress, 90));
          if (uploadProgress >= 90) clearInterval(progressInterval);
        }, 150);

        const uploadResult = await uploadPitchDeck(file);
        clearInterval(progressInterval);
        setProgress(100);

        usePitchDeckStore.getState().setCurrentUpload(uploadResult);

        // Start analysis
        setCurrentStage('analyzing');
        usePitchDeckStore.getState().setUploadState('analyzing');
        setProgress(0);

        // Analysis progress simulation
        let analysisProgress = 0;
        const analysisInterval = setInterval(() => {
          analysisProgress += 5;
          setProgress(Math.min(analysisProgress, 90));
          if (analysisProgress >= 90) clearInterval(analysisInterval);
        }, 150);

        const result = await analyzePitchDeck(uploadResult.uuid, file.name);
        clearInterval(analysisInterval);
        setProgress(100);

        usePitchDeckStore.getState().setCurrentAnalysis(result);
        toast.success('Analysis complete!');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        usePitchDeckStore.getState().setError(message);
        toast.error(message);
      }
    },
    [reset, setCurrentStage]
  );

  const handleCancel = useCallback(() => {
    reset();
    setProgress(0);
  }, [reset]);

  const handleReset = useCallback(() => {
    reset();
    setProgress(0);
  }, [reset]);

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pitch Deck Analysis</h1>
        <p className="text-muted-foreground">
          Upload your pitch deck to get AI-powered insights based on VC framework
        </p>
      </div>

      {/* File uploader - shown when idle */}
      {uploadState === 'idle' && !currentAnalysis && (
        <FileUploader onFileSelect={handleFileSelect} />
      )}

      {/* Upload/Analysis progress */}
      {(uploadState === 'uploading' || uploadState === 'analyzing') && currentUpload && (
        <UploadProgress
          filename={currentUpload.files?.[0]?.originalFileName ?? currentUpload.title}
          fileType={currentUpload.files?.[0]?.mimeType ?? 'application/pdf'}
          progress={progress}
          state={currentStage}
          onCancel={handleCancel}
        />
      )}

      {/* Error state */}
      {uploadState === 'error' && (
        <div className="border border-destructive bg-destructive/10 rounded-lg p-4">
          <p className="text-destructive font-medium">Error</p>
          <p className="text-sm text-destructive/80">{error}</p>
          <button onClick={handleReset} className="mt-4 text-sm text-primary hover:underline">
            Try again
          </button>
        </div>
      )}

      {/* Analysis result */}
      {uploadState === 'completed' && currentAnalysis && (
        <>
          <AnalysisResult analysis={currentAnalysis} />

          {/* Reset button */}
          <div className="mt-8 text-center">
            <button onClick={handleReset} className="text-primary hover:underline text-sm">
              Analyze another pitch deck
            </button>
          </div>
        </>
      )}
    </div>
  );
}
