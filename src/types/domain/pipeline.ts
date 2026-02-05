/**
 * Pipeline Domain Types
 * Types for AI pipeline workflow state management
 */

import type { AnalysisStatusResponse } from '@/types/response/pitch-deck';

export type PipelineStageStatus = 'pending' | 'running' | 'completed' | 'failed';

export interface PipelineStage {
  id: string;
  name: string;
  status: PipelineStageStatus;
  progress: number;
  startTime?: Date;
  endTime?: Date;
  errorMessage?: string;
}

export interface PipelineState {
  // Analysis UUID
  analysisUuid: string | null;

  // Overall status
  overallStatus: AnalysisStatusResponse['status'] | null;
  overallProgress: number;

  // Stage tracking
  stages: Record<string, PipelineStage>;
  currentStage: string | null;

  // Polling state
  isPolling: boolean;
  pollCount: number;

  // Error state
  error: string | null;
}

export interface PipelineActions {
  // Analysis management
  setAnalysisUuid: (uuid: string) => void;
  clearAnalysis: () => void;

  // Status updates
  setOverallStatus: (status: PipelineState['overallStatus']) => void;
  setOverallProgress: (progress: number) => void;

  // Stage management
  setStages: (stages: PipelineState['stages']) => void;
  updateStage: (stageId: string, updates: Partial<PipelineStage>) => void;
  setCurrentStage: (stageId: string | null) => void;

  // Polling control
  setPolling: (isPolling: boolean) => void;
  incrementPollCount: () => void;
  resetPollCount: () => void;

  // Error handling
  setError: (error: string | null) => void;

  // Reset
  reset: () => void;

  // Mock mode for development/demo
  mockCompleted: () => void;
}

export type PipelineStore = PipelineState & PipelineActions;
