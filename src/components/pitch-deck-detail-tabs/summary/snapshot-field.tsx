/**
 * Snapshot Field
 * Reusable field pair component for summary tab
 */

import { Card, CardContent } from '@/components/ui/card';

import { cn } from '@/lib/utils';

interface SnapshotFieldProps {
  label: string;
  value: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function SnapshotField({
  label,
  value,
  variant = 'default',
  className
}: SnapshotFieldProps) {
  const variantStyles = {
    default: 'bg-card',
    success: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-800',
    warning: 'bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800',
    danger: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800'
  };

  return (
    <Card className={cn(variantStyles[variant], className)}>
      <CardContent className="p-4">
        <div className="text-xs font-medium text-muted-foreground mb-1">{label}</div>
        <div className="text-sm">{value}</div>
      </CardContent>
    </Card>
  );
}

interface SnapshotFieldPairProps {
  leftLabel: string;
  leftValue: string;
  rightLabel: string;
  rightValue: string;
  leftVariant?: 'default' | 'success' | 'warning' | 'danger';
  rightVariant?: 'default' | 'success' | 'warning' | 'danger';
}

export function SnapshotFieldPair({
  leftLabel,
  leftValue,
  rightLabel,
  rightValue,
  leftVariant = 'default',
  rightVariant = 'default'
}: SnapshotFieldPairProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SnapshotField label={leftLabel} value={leftValue} variant={leftVariant} />
      <SnapshotField label={rightLabel} value={rightValue} variant={rightVariant} />
    </div>
  );
}
