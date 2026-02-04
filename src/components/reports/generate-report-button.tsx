'use client';

import { useReportStore } from '@/stores/report-store';
import type { ReportType } from '@/types/response/report';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { ReportTypeSelector } from './report-type-selector';

type GenerateReportButtonProps = {
  analysisUuid: string;
  onGenerated?: () => void;
};

export const GenerateReportButton = ({ analysisUuid, onGenerated }: GenerateReportButtonProps) => {
  const { generateReport, isGenerating } = useReportStore();
  const generating = isGenerating(analysisUuid);

  const handleGenerate = async (type: ReportType) => {
    try {
      toast.loading(`Generating ${type} report...`, { id: 'report-generation' });

      await generateReport(analysisUuid, { reportType: type, format: 'markdown' }, (status) => {
        toast.loading(`Report status: ${status}`, { id: 'report-generation' });
      });

      toast.success('Report generated successfully', { id: 'report-generation' });
      onGenerated?.();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate report';
      toast.error(errorMsg, { id: 'report-generation' });
    }
  };

  if (generating) {
    return (
      <Button disabled variant="outline">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Generating...
      </Button>
    );
  }

  return <ReportTypeSelector onSelect={handleGenerate} disabled={generating} />;
};
