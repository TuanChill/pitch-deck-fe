/**
 * Request types for report generation API endpoints
 */

// ==================== Report Request Types ====================

/**
 * Report generation request
 * POST /analysis/:analysisUuid/reports
 */
export interface GenerateReportRequest {
  reportType: 'executive' | 'detailed' | 'investor';
  format?: 'markdown' | 'json';
}
