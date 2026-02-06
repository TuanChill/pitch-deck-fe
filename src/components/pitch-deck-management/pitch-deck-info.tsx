'use client';

import { FILE_TYPE_LABELS } from '@/constants/file-types';
import { formatFileSize } from '@/constants/file-types';
import type { PitchDeckStatus } from '@/constants/pitch-deck-status';
import { cn } from '@/utils';
import { FileText, Tag } from 'lucide-react';

type UploadedFile = {
  originalFileName: string;
  fileSize: number;
  mimeType: string;
};

export type PitchDeckInfoProps = {
  description?: string | null;
  tags?: string[] | null;
  files?: UploadedFile[];
  status: PitchDeckStatus;
  className?: string;
};

const InfoSection = ({
  title,
  icon: Icon,
  children
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
      <Icon className="w-4 h-4" />
      <span>{title}</span>
    </div>
    <div className="pl-6">{children}</div>
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
    {children}
  </span>
);

const FileItem = ({
  fileName,
  fileSize,
  mimeType
}: {
  fileName: string;
  fileSize: number;
  mimeType: string;
}) => {
  const typeLabel = FILE_TYPE_LABELS[mimeType] || mimeType.split('/')[1]?.toUpperCase() || 'FILE';

  return (
    <div className="flex items-center gap-3 p-3 rounded-lg border bg-card">
      <FileText className="w-5 h-5 text-muted-foreground shrink-0" />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate">{fileName}</p>
        <p className="text-xs text-muted-foreground">
          {formatFileSize(fileSize)} • {typeLabel}
        </p>
      </div>
    </div>
  );
};

export const PitchDeckInfo = ({
  description,
  tags,
  files,
  status: _status,
  className
}: PitchDeckInfoProps) => {
  const hasFiles = files && files.length > 0;

  return (
    <div className={cn('space-y-6', className)}>
      {/* Description Section */}
      {description && (
        <InfoSection title="Description" icon={FileText}>
          <p className="text-sm leading-relaxed">{description}</p>
        </InfoSection>
      )}

      {/* Tags Section */}
      {tags && tags.length > 0 && (
        <InfoSection title="Tags" icon={Tag}>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Chip key={tag}>{tag}</Chip>
            ))}
          </div>
        </InfoSection>
      )}

      {/* Files Section */}
      {hasFiles && (
        <InfoSection title="Files" icon={FileText}>
          <div className="space-y-2">
            {files.map((file, index) => (
              <FileItem
                key={index}
                fileName={file.originalFileName}
                fileSize={file.fileSize}
                mimeType={file.mimeType}
              />
            ))}
          </div>
        </InfoSection>
      )}
    </div>
  );
};
