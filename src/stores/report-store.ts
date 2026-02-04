/**
 * Report Store
 *
 * Manages report generation state and operations.
 * Phase 05: Report generation UI state management.
 *
 * @module stores/report
 */

import { generateReportAndWait, listReports } from '@/services/api/report.service';
import type { GenerateReportRequest } from '@/types/request/report';
import type { ReportResponse, ReportType } from '@/types/response/report';
import { create } from 'zustand';

type State = {
  /** Reports grouped by analysis UUID */
  reports: Record<string, ReportResponse[]>;
  /** Set of analysis UUIDs currently generating reports */
  generatingIds: Set<string>;
  /** Errors keyed by analysis UUID */
  errors: Record<string, string>;
};

type Actions = {
  /** Generate report and poll until complete */
  generateReport: (
    analysisUuid: string,
    request: GenerateReportRequest,
    onProgress?: (status: string) => void
  ) => Promise<ReportResponse>;
  /** Load all reports for an analysis */
  loadReports: (analysisUuid: string) => Promise<void>;
  /** Clear error for an analysis */
  clearError: (analysisUuid: string) => void;
  /** Check if analysis is currently generating a report */
  isGenerating: (analysisUuid: string) => boolean;
  /** Get latest report of specific type for an analysis */
  getLatestReport: (analysisUuid: string, type?: ReportType) => ReportResponse | null;
};

const defaultState: State = {
  reports: {},
  generatingIds: new Set(),
  errors: {}
};

export const useReportStore = create<State & Actions>()((set, get) => ({
  ...defaultState,

  generateReport: async (analysisUuid, request, onProgress) => {
    // Mark as generating
    set((state) => ({
      generatingIds: new Set(state.generatingIds).add(analysisUuid),
      errors: { ...state.errors, [analysisUuid]: '' }
    }));

    try {
      // Generate report and wait for completion
      const report = await generateReportAndWait(analysisUuid, request, {
        onProgress
      });

      // Add to reports list
      set((state) => {
        const existingReports = state.reports[analysisUuid] || [];
        const updatedReports = [report, ...existingReports.filter((r) => r.uuid !== report.uuid)];

        const newGeneratingIds = new Set(state.generatingIds);
        newGeneratingIds.delete(analysisUuid);

        return {
          reports: { ...state.reports, [analysisUuid]: updatedReports },
          generatingIds: newGeneratingIds
        };
      });

      return report;
    } catch (err) {
      // Handle error
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate report';

      set((state) => {
        const newGeneratingIds = new Set(state.generatingIds);
        newGeneratingIds.delete(analysisUuid);

        return {
          generatingIds: newGeneratingIds,
          errors: { ...state.errors, [analysisUuid]: errorMsg }
        };
      });

      throw err;
    }
  },

  loadReports: async (analysisUuid) => {
    try {
      const reports = await listReports(analysisUuid);

      set((state) => ({
        reports: { ...state.reports, [analysisUuid]: reports }
      }));
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load reports';

      set((state) => ({
        errors: { ...state.errors, [analysisUuid]: errorMsg }
      }));

      throw err;
    }
  },

  clearError: (analysisUuid) => {
    set((state) => ({
      errors: { ...state.errors, [analysisUuid]: '' }
    }));
  },

  isGenerating: (analysisUuid) => {
    return get().generatingIds.has(analysisUuid);
  },

  getLatestReport: (analysisUuid, type?) => {
    const reports = get().reports[analysisUuid] || [];
    const filtered = type ? reports.filter((r) => r.reportType === type) : reports;

    return filtered.length > 0 ? filtered[0] : null;
  }
}));
