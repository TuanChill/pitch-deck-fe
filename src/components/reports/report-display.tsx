'use client';

import { useReportStore } from '@/stores/report-store';
import type { ReportResponse, ReportType } from '@/types/response/report';
import { cn } from '@/utils';
import { AlertCircle, Briefcase, FileSpreadsheet, FileText, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { ReportSkeleton } from './report-skeleton';

const REPORT_TYPE_CONFIG: Record<
  ReportType,
  { icon: typeof FileText; label: string; variant: 'default' | 'secondary' | 'outline' }
> = {
  executive: { icon: FileText, label: 'Executive', variant: 'default' },
  detailed: { icon: FileSpreadsheet, label: 'Detailed', variant: 'secondary' },
  investor: { icon: Briefcase, label: 'Investor', variant: 'outline' }
};

type ReportDisplayProps = {
  analysisUuid: string;
  reportType?: ReportType;
  className?: string;
};

export const ReportDisplay = ({ analysisUuid, reportType, className }: ReportDisplayProps) => {
  const { reports, errors, isGenerating, clearError } = useReportStore();

  const error = errors[analysisUuid];
  const generating = isGenerating(analysisUuid);
  const analysisReports = reports[analysisUuid] || [];

  // Get latest report of specified type or any type
  const report: ReportResponse | null = reportType
    ? analysisReports.find((r) => r.reportType === reportType) || null
    : analysisReports[0] || null;

  // Loading state - fetching reports
  if (!report && !error && !generating) {
    return <ReportSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive" className={cn(className)}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <span>{error}</span>
          <Button variant="outline" size="sm" onClick={() => clearError(analysisUuid)}>
            Dismiss
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  // Generating state
  if (generating) {
    return (
      <Card className={cn(className)}>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generating report...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No report state
  if (!report) {
    return (
      <Card className={cn(className)}>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-sm text-muted-foreground">No report available</p>
        </CardContent>
      </Card>
    );
  }

  const config = REPORT_TYPE_CONFIG[report.reportType];
  const Icon = config.icon;

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            <CardTitle>Report</CardTitle>
          </div>
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
        {report.generatedAt && (
          <CardDescription>
            Generated {new Date(report.generatedAt).toLocaleString()}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {report.status === 'completed' && report.content ? (
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{report.content}</ReactMarkdown>
          </div>
        ) : report.status === 'failed' ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{report.errorMessage || 'Report generation failed'}</AlertDescription>
          </Alert>
        ) : (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Status: {report.status}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
