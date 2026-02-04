'use client';

import type { ReportType } from '@/types/response/report';
import { Briefcase, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

type ReportTypeOption = {
  value: ReportType;
  label: string;
  description: string;
  icon: typeof FileText;
};

const REPORT_TYPE_OPTIONS: ReportTypeOption[] = [
  {
    value: 'executive',
    label: 'Executive Summary',
    description: 'High-level overview for decision makers',
    icon: FileText
  },
  {
    value: 'detailed',
    label: 'Detailed Analysis',
    description: 'Comprehensive breakdown with metrics',
    icon: FileSpreadsheet
  },
  {
    value: 'investor',
    label: 'Investor Report',
    description: 'Investment-focused insights',
    icon: Briefcase
  }
];

type ReportTypeSelectorProps = {
  onSelect: (type: ReportType) => void;
  disabled?: boolean;
};

export const ReportTypeSelector = ({ onSelect, disabled }: ReportTypeSelectorProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled}>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        {REPORT_TYPE_OPTIONS.map((option) => {
          const Icon = option.icon;

          return (
            <DropdownMenuItem
              key={option.value}
              onClick={() => onSelect(option.value)}
              className="flex flex-col items-start gap-1 py-3"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span className="font-medium">{option.label}</span>
              </div>
              <span className="text-xs text-muted-foreground">{option.description}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
