import { ImpactLevel, SeverityLevel } from '@/types/response/pitch-deck';

export const IMPACT_CONFIG: Record<
  ImpactLevel,
  {
    label: string;
    color: string;
    bgColor: string;
    icon: string;
  }
> = {
  high: {
    label: 'High Impact',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    icon: '🚀'
  },
  medium: {
    label: 'Medium Impact',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    icon: '⚡'
  },
  low: {
    label: 'Low Impact',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    icon: '•'
  }
};

export const SEVERITY_CONFIG: Record<
  SeverityLevel,
  {
    label: string;
    color: string;
    bgColor: string;
    priority: number;
  }
> = {
  high: {
    label: 'High Priority',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    priority: 1
  },
  medium: {
    label: 'Medium Priority',
    color: 'text-amber-600 dark:text-amber-400',
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    priority: 2
  },
  low: {
    label: 'Low Priority',
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100 dark:bg-gray-900/30',
    priority: 3
  }
};
