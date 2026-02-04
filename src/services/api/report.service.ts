/**
 * Report API Service
 *
 * Implements all report generation operations using real backend API.
 * Phase 04: Report generation service layer.
 *
 * Backend: http://localhost:8082
 * Auth: JWT handled by httpClient interceptor
 *
 * Report generation is an async operation:
 * 1. generateReport() - triggers report generation, returns report UUID
 * 2. getReport() - get report with status (pending/generating/completed/failed)
 * 3. listReports() - get all reports for an analysis
 * 4. pollReportComplete() - poll until report is ready (2s interval, 60 max attempts)
 * 5. generateReportAndWait() - convenience wrapper for generate + poll
 */

import { API_URL } from '@/constants/api-url';
import { httpClient } from '@/services/http/client';
import type { GenerateReportRequest } from '@/types/request/report';
import type { ListReportsResponse, ReportResponse } from '@/types/response/report';

// ==================== Constants ====================

/** Default polling configuration */
const DEFAULT_POLL_CONFIG = {
  maxAttempts: 60, // 60 attempts = ~2 minutes with 2s interval
  interval: 2000 // 2 seconds between polls
} as const;

/** Report status values that indicate completion */
const COMPLETED_STATUSES = ['completed', 'failed'] as const;
const TERMINAL_STATUSES = [...COMPLETED_STATUSES] as const;

// ==================== Public API ====================

/**
 * Generate report for an analysis
 * POST /analysis/:analysisUuid/reports
 *
 * @param analysisUuid - UUID of the analysis to generate report for
 * @param request - Report generation request with type and format
 * @returns Report response with UUID and initial status
 */
export const generateReport = async (
  analysisUuid: string,
  request: GenerateReportRequest
): Promise<ReportResponse> => {
  const response = await httpClient.post<ReportResponse>(
    API_URL.REPORT.GENERATE(analysisUuid),
    request
  );

  return response.data;
};

/**
 * Get report by UUID
 * GET /analysis/:analysisUuid/reports/:reportUuid
 *
 * @param analysisUuid - UUID of the analysis
 * @param reportUuid - UUID of the report
 * @returns Report response with current status and content if completed
 */
export const getReport = async (
  analysisUuid: string,
  reportUuid: string
): Promise<ReportResponse> => {
  const response = await httpClient.get<ReportResponse>(
    API_URL.REPORT.DETAIL(analysisUuid, reportUuid)
  );

  return response.data;
};

/**
 * List all reports for an analysis
 * GET /analysis/:analysisUuid/reports
 *
 * @param analysisUuid - UUID of the analysis
 * @returns Array of report responses
 */
export const listReports = async (analysisUuid: string): Promise<ListReportsResponse> => {
  const response = await httpClient.get<ListReportsResponse>(API_URL.REPORT.LIST(analysisUuid));

  return response.data;
};

// ==================== Polling Helpers ====================

/**
 * Sleep for specified milliseconds
 *
 * @param ms - Milliseconds to sleep
 * @returns Promise that resolves after delay
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Poll report status until completion or failure
 *
 * Uses fixed 2-second interval polling:
 * - Polls every 2 seconds
 * - Maximum 60 attempts (~2 minutes total)
 * - Throws error if max attempts exceeded
 *
 * @param analysisUuid - UUID of the analysis
 * @param reportUuid - UUID of the report to poll
 * @param options - Polling configuration
 * @returns Complete report response with content
 * @throws Error if max attempts exceeded or report failed
 */
export const pollReportComplete = async (
  analysisUuid: string,
  reportUuid: string,
  options: {
    maxAttempts?: number;
    interval?: number;
    onProgress?: (status: string) => void;
  } = {}
): Promise<ReportResponse> => {
  const {
    maxAttempts = DEFAULT_POLL_CONFIG.maxAttempts,
    interval = DEFAULT_POLL_CONFIG.interval,
    onProgress
  } = options;

  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    // Get current report status
    const reportResponse = await getReport(analysisUuid, reportUuid);

    // Report progress if callback provided
    if (onProgress) {
      onProgress(reportResponse.status);
    }

    // Check if terminal status reached
    if (TERMINAL_STATUSES.includes(reportResponse.status as never)) {
      // If failed, throw error with message
      if (reportResponse.status === 'failed') {
        throw new Error(reportResponse.errorMessage || 'Report generation failed');
      }

      return reportResponse;
    }

    // Wait before next poll
    await sleep(interval);
  }

  // Max attempts exceeded
  throw new Error(
    `Report polling exceeded maximum attempts (${maxAttempts}). ` +
      `The report may still be generating - check status manually.`
  );
};

/**
 * Generate report and poll until complete (convenience wrapper)
 *
 * Combines generateReport() + pollReportComplete() for common use case.
 *
 * @param analysisUuid - UUID of the analysis to generate report for
 * @param request - Report generation request
 * @param pollOptions - Polling configuration
 * @returns Complete report response with content
 */
export const generateReportAndWait = async (
  analysisUuid: string,
  request: GenerateReportRequest,
  pollOptions?: {
    maxAttempts?: number;
    interval?: number;
    onProgress?: (status: string) => void;
  }
): Promise<ReportResponse> => {
  // Generate the report
  const startResponse = await generateReport(analysisUuid, request);

  // Poll until complete
  return pollReportComplete(analysisUuid, startResponse.uuid, pollOptions);
};
