/**
 * Summary Table
 * Category-sectioned table layout for summary tab
 */

import type { SummaryData } from '@/types/response/summary';
import { memo } from 'react';

import { Table, TableBody, TableCell, TableHead, TableRow } from '@/components/ui/table';

import { cn } from '@/lib/utils';

interface CategorySection {
  title: string;
  fields: Array<{
    label: string;
    key: keyof SummaryData;
    variant?: 'default' | 'highlight';
  }>;
}

const CATEGORY_SECTIONS: CategorySection[] = [
  {
    title: 'Overview',
    fields: [{ label: 'One-Liner', key: 'oneLiner' }]
  },
  {
    title: 'Problem & Solution',
    fields: [
      { label: 'Problem', key: 'problem' },
      { label: 'Solution', key: 'solution' }
    ]
  },
  {
    title: 'Market & Product',
    fields: [
      { label: 'Market', key: 'market' },
      { label: 'Product', key: 'product' }
    ]
  },
  {
    title: 'Business Model',
    fields: [
      { label: 'Traction', key: 'traction' },
      { label: 'Business Model', key: 'businessModel' },
      { label: 'Fundraising', key: 'fundraising' }
    ]
  },
  {
    title: 'Competitive Advantage',
    fields: [
      { label: 'Moat', key: 'moat' },
      { label: 'Team', key: 'team' }
    ]
  }
];

interface SummaryTableProps {
  data: SummaryData;
}

// Helper function to render cell values with proper type safety
const renderCellValue = (key: keyof SummaryData, value: SummaryData[keyof SummaryData]) => {
  // Handle null/undefined values
  if (value === null || value === undefined) {
    return 'N/A';
  }

  // All fields are strings
  return String(value);
};

export const SummaryTable = memo(function SummaryTable({ data }: SummaryTableProps) {
  return (
    <div className="space-y-6">
      {CATEGORY_SECTIONS.map((section) => (
        <div key={section.title} className="rounded-lg border bg-card">
          {/* Category Header */}
          <div className="border-b bg-muted/50 px-4 py-3">
            <h3 className="font-semibold text-sm">{section.title}</h3>
          </div>

          {/* Table */}
          <Table>
            <TableBody>
              {section.fields.map((field) => {
                const value = data[field.key];

                return (
                  <TableRow key={field.key}>
                    <TableHead className="w-[140px] font-medium text-muted-foreground">
                      {field.label}
                    </TableHead>
                    <TableCell className={cn(field.variant === 'highlight' && 'font-medium')}>
                      {renderCellValue(field.key, value)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
});
