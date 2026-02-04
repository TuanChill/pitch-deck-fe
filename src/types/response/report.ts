/**
 * Response types for report generation API endpoints
 */

// ==================== Report Response Types ====================

/**
 * Report status values
 */
export type ReportStatus = 'pending' | 'generating' | 'completed' | 'failed';

/**
 * Report type options
 */
export type ReportType = 'executive' | 'detailed' | 'investor';

/**
 * Report format options
 */
export type ReportFormat = 'markdown' | 'json';

/**
 * Single report response
 * GET /analysis/:analysisUuid/reports/:reportUuid
 * POST /analysis/:analysisUuid/reports
 */
export interface ReportResponse {
  uuid: string;
  reportType: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  content?: string;
  generatedAt?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * List reports response
 * GET /analysis/:analysisUuid/reports
 */
export type ListReportsResponse = ReportResponse[];
