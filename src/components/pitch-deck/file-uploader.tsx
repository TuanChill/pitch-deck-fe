'use client';

import { ALLOWED_PITCH_DECK_TYPES, MAX_PITCH_DECK_SIZE } from '@/constants/file-types';
import { validatePitchDeckFile } from '@/constants/file-types';
import { cn } from '@/utils';
import { FileText, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';

type FileUploaderProps = {
  onFilesSelect: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  selectedFiles?: File[];
};

export const FileUploader = ({
  onFilesSelect,
  disabled,
  className,
  selectedFiles = []
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateAndSelectFiles = useCallback(
    (newFiles: FileList | File[]) => {
      const filesArray = Array.from(newFiles);
      const validFiles: File[] = [];
      const errors: string[] = [];

      // Check total count limit (10 max)
      const totalCount = selectedFiles.length + filesArray.length;
      if (totalCount > 10) {
        setError(
          `Maximum 10 files allowed. Currently: ${selectedFiles.length}, adding: ${filesArray.length}`
        );

        return;
      }

      // Validate each file
      filesArray.forEach((file) => {
        const validation = validatePitchDeckFile(file);
        if (!validation.valid) {
          errors.push(`${file.name}: ${validation.error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        setError(errors.join('; '));
        // Still add valid files
        if (validFiles.length > 0) {
          onFilesSelect([...selectedFiles, ...validFiles]);
          setError(null);
        }
      } else {
        setError(null);
        onFilesSelect([...selectedFiles, ...validFiles]);
      }
    },
    [onFilesSelect, selectedFiles]
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

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        validateAndSelectFiles(files);
      }
    },
    [validateAndSelectFiles]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        validateAndSelectFiles(files);
      }
    },
    [validateAndSelectFiles]
  );

  const handleRemoveFile = useCallback(
    (index: number) => {
      const updatedFiles = selectedFiles.filter((_, i) => i !== index);
      onFilesSelect(updatedFiles);
      setError(null);
    },
    [onFilesSelect, selectedFiles]
  );

  return (
    <div className={cn('w-full', className)}>
      {/* Selected Files List */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2 mb-4">
          <p className="text-sm font-medium">Selected Files ({selectedFiles.length}/10)</p>
          {selectedFiles.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
            >
              <FileText className="w-8 h-8 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveFile(index)}
                  className="shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload Area - Always show to allow adding more files */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-muted-foreground/25 hover:border-primary/50',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input
          type="file"
          accept={ALLOWED_PITCH_DECK_TYPES.join(',')}
          multiple
          onChange={handleFileInput}
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />

        <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />

        <p className="text-sm font-medium mb-1">Drop files here or click to browse</p>

        <p className="text-xs text-muted-foreground mb-3">
          PDF, PPT, PPTX, DOC, DOCX, TXT (max {MAX_PITCH_DECK_SIZE / 1024 / 1024}MB each, 10 files
          total)
        </p>

        <Button type="button" variant="outline" size="sm" disabled={disabled}>
          {selectedFiles.length > 0 ? 'Add More Files' : 'Select Files'}
        </Button>
      </div>

      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
};
