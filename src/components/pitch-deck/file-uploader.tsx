'use client';

import { ALLOWED_PITCH_DECK_TYPES, MAX_PITCH_DECK_SIZE } from '@/constants/file-types';
import { validatePitchDeckFile } from '@/constants/file-types';
import { cn } from '@/utils';
import { FileText, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';

type FileUploaderProps = {
  onFileSelect: (file: File) => void;
  onFileClear?: () => void;
  disabled?: boolean;
  className?: string;
  selectedFile?: File | null;
};

export const FileUploader = ({
  onFileSelect,
  onFileClear,
  disabled,
  className,
  selectedFile
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateAndSelect = useCallback(
    (file: File) => {
      const validation = validatePitchDeckFile(file);
      if (!validation.valid) {
        setError(validation.error || 'Invalid file');

        return;
      }
      setError(null);
      onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        validateAndSelect(file);
      }
    },
    [validateAndSelect]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        validateAndSelect(file);
      }
    },
    [validateAndSelect]
  );

  return (
    <div className={cn('w-full', className)}>
      {selectedFile ? (
        <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
          <FileText className="w-10 h-10 text-primary shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{selectedFile.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
          </div>
          {!disabled && onFileClear && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onFileClear}
              className="shrink-0"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            'relative border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <input
            type="file"
            accept={ALLOWED_PITCH_DECK_TYPES.join(',')}
            onChange={handleFileInput}
            disabled={disabled}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />

          <p className="text-sm font-medium mb-1">Drop your pitch deck here, or click to browse</p>

          <p className="text-xs text-muted-foreground mb-4">
            Supported formats: PDF, PPT, PPTX, DOC, DOCX, TXT (max{' '}
            {MAX_PITCH_DECK_SIZE / 1024 / 1024}
            MB)
          </p>

          <Button type="button" variant="outline" size="sm" disabled={disabled}>
            Select File
          </Button>
        </div>
      )}

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
};
