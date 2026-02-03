'use client';

import { FILE_TYPE_LABELS, formatFileSize } from '@/constants/file-types';
import { cn } from '@/utils';
import { FileText, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';

type FilePreviewCardProps = {
  filename: string;
  fileType: string;
  fileSize: number;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
};

export const FilePreviewCard = ({
  filename,
  fileType,
  fileSize,
  onRemove,
  disabled,
  className
}: FilePreviewCardProps) => {
  return (
    <div className={cn('border rounded-lg p-4', className)}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-md bg-primary/10 flex items-center justify-center">
          <FileText className="w-6 h-6 text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{filename}</p>
          <p className="text-xs text-muted-foreground">
            {FILE_TYPE_LABELS[fileType] || fileType} • {formatFileSize(fileSize)}
          </p>
        </div>

        {onRemove && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="shrink-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
};
