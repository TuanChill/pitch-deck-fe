'use client';

import { APP_URL } from '@/constants/routes';
import { uploadPitchDeck } from '@/services/api/pitch-deck.service';
import type { PitchDeckListItem } from '@/types/response/pitch-deck';
import { useRouter } from 'next/navigation';
import { useCallback, useState, useRef, useEffect } from 'react';

import { FileUploader } from '@/components/pitch-deck/file-uploader';
import { Button } from '@/components/ui/button';

import { MetadataInputs } from './metadata-inputs';
import {
  UploadProgressTracker,
  UploadSuccessActions,
  type UploadState
} from './upload-progress-tracker';

export type UploadFormProps = {
  onSuccess?: (uuid: string) => void;
  onCancel?: () => void;
  className?: string;
};

type FormState = {
  selectedFile: File | null;
  title: string;
  description: string;
  tags: string[];
  uploadProgress: number;
  uploadState: UploadState;
  uploadError: string | null;
  uploadedDeck: PitchDeckListItem | null;
};

const INITIAL_FORM_STATE: FormState = {
  selectedFile: null,
  title: '',
  description: '',
  tags: [],
  uploadProgress: 0,
  uploadState: 'idle',
  uploadError: null,
  uploadedDeck: null
};

export const UploadForm = ({ onSuccess, onCancel, className }: UploadFormProps) => {
  const router = useRouter();

  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);

  const {
    selectedFile,
    title,
    description,
    tags,
    uploadProgress,
    uploadState,
    uploadError,
    uploadedDeck
  } = formState;

  const isUploading = uploadState === 'uploading' || uploadState === 'processing';
  const isComplete = uploadState === 'success';
  const hasError = uploadState === 'error';

  const canSubmit = selectedFile !== null && title.trim().length > 0 && !isUploading;

  const handleFileSelect = useCallback((file: File) => {
    setFormState((prev) => ({
      ...prev,
      selectedFile: file,
      uploadError: null
    }));
  }, []);

  const handleFileClear = useCallback(() => {
    setFormState((prev) => ({
      ...prev,
      selectedFile: null,
      uploadError: null
    }));
  }, []);

  const handleTitleChange = useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, title: value }));
  }, []);

  const handleDescriptionChange = useCallback((value: string) => {
    setFormState((prev) => ({ ...prev, description: value }));
  }, []);

  const handleTagsChange = useCallback((newTags: string[]) => {
    setFormState((prev) => ({ ...prev, tags: newTags }));
  }, []);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const simulateProgress = useCallback((onComplete: () => void) => {
    let progress = 0;
    intervalRef.current = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 90) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setFormState((prev) => ({ ...prev, uploadProgress: 90, uploadState: 'processing' }));
        onComplete();
      } else {
        setFormState((prev) => ({
          ...prev,
          uploadProgress: Math.min(progress, 90)
        }));
      }
    }, 200);
  }, []);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedFile || !title.trim()) {
      return;
    }

    setFormState((prev) => ({
      ...prev,
      uploadState: 'uploading',
      uploadProgress: 0,
      uploadError: null
    }));

    try {
      simulateProgress(async () => {
        try {
          const response = await uploadPitchDeck(selectedFile);

          const mockDeck: PitchDeckListItem = {
            id: response.uuid,
            uuid: response.uuid,
            title: title.trim(),
            description: description.trim() || null,
            status: 'processing',
            chunkCount: 0,
            fileCount: 1,
            errorMessage: null,
            tags: tags.length > 0 ? tags : null,
            files: [
              {
                uuid: response.uuid,
                originalFileName: response.filename,
                mimeType: response.fileType,
                fileSize: response.fileSize,
                status: 'processing',
                storagePath: '',
                createdAt: response.uploadedAt,
                updatedAt: response.uploadedAt
              }
            ],
            createdAt: response.uploadedAt,
            updatedAt: response.uploadedAt,
            lastAccessedAt: response.uploadedAt
          };

          setFormState((prev) => ({
            ...prev,
            uploadProgress: 100,
            uploadState: 'success',
            uploadedDeck: mockDeck
          }));

          onSuccess?.(mockDeck.uuid);
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : 'Upload failed. Please try again.';
          setFormState((prev) => ({
            ...prev,
            uploadState: 'error',
            uploadError: errorMessage
          }));
        }
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed. Please try again.';
      setFormState((prev) => ({
        ...prev,
        uploadState: 'error',
        uploadError: errorMessage
      }));
    }
  }, [selectedFile, title, description, tags, simulateProgress, onSuccess]);

  const handleReset = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
  }, []);

  const handleViewDeck = useCallback(() => {
    if (uploadedDeck) {
      router.push(APP_URL.PITCH_DECK_DETAIL(uploadedDeck.uuid));
    }
  }, [uploadedDeck, router]);

  const handleBackToList = useCallback(() => {
    router.push(APP_URL.PITCH_DECKS);
  }, [router]);

  return (
    <div className={className}>
      {/* Upload Progress / Success / Error */}
      {isUploading || isComplete || hasError ? (
        <div className="space-y-6">
          <UploadProgressTracker
            filename={selectedFile?.name || 'Unknown file'}
            progress={uploadProgress}
            state={uploadState}
            error={uploadError ?? undefined}
          />

          {isComplete && uploadedDeck && (
            <UploadSuccessActions
              onViewDeck={handleViewDeck}
              onUploadAnother={handleReset}
              onBackToList={handleBackToList}
            />
          )}

          {hasError && (
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleBackToList}
                disabled={isUploading}
              >
                Back to List
              </Button>
              <Button type="button" onClick={handleReset} disabled={isUploading}>
                Try Again
              </Button>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* File Uploader */}
          <div className="space-y-2 mb-6">
            <label className="text-sm font-medium">Pitch Deck File</label>
            <FileUploader
              onFileSelect={handleFileSelect}
              onFileClear={handleFileClear}
              selectedFile={selectedFile}
              disabled={isUploading}
            />
          </div>

          {/* Metadata Inputs */}
          <MetadataInputs
            title={title}
            description={description}
            tags={tags}
            onTitleChange={handleTitleChange}
            onDescriptionChange={handleDescriptionChange}
            onTagsChange={handleTagsChange}
            disabled={isUploading}
            className="mb-6"
          />

          {/* Form Actions */}
          <div className="flex gap-3 justify-end pt-4 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isUploading}>
                Cancel
              </Button>
            )}
            <Button type="button" onClick={handleSubmit} disabled={!canSubmit || isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Pitch Deck'}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
