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
  selectedFiles: File[];
  title: string;
  description: string;
  tags: string[];
  uploadProgress: number;
  uploadState: UploadState;
  uploadError: string | null;
  uploadedDeck: PitchDeckListItem | null;
};

const INITIAL_FORM_STATE: FormState = {
  selectedFiles: [],
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
    selectedFiles,
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

  const canSubmit = selectedFiles.length > 0 && title.trim().length > 0 && !isUploading;

  const handleFilesSelect = useCallback((files: File[]) => {
    setFormState((prev) => ({
      ...prev,
      selectedFiles: files,
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
    if (selectedFiles.length === 0 || !title.trim()) {
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
          const response = await uploadPitchDeck({
            files: selectedFiles,
            title,
            description,
            tags
          });

          // Response is PitchDeckDetailResponse which extends PitchDeckListItem
          // No need for redundant type conversion - use response directly
          setFormState((prev) => ({
            ...prev,
            uploadProgress: 100,
            uploadState: 'success',
            uploadedDeck: response
          }));

          onSuccess?.(response.id);
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
  }, [selectedFiles, title, description, tags, simulateProgress, onSuccess]);

  const handleReset = useCallback(() => {
    setFormState(INITIAL_FORM_STATE);
  }, []);

  const handleViewDeck = useCallback(() => {
    if (uploadedDeck) {
      router.push(APP_URL.PITCH_DECK_DETAIL(uploadedDeck.id));
    }
  }, [uploadedDeck, router]);

  const handleBackToList = useCallback(() => {
    router.push(APP_URL.PITCH_DECKS);
  }, [router]);

  // Get filenames for progress display
  const filenames = selectedFiles.map((f) => f.name).join(', ');

  return (
    <div className={className}>
      {/* Upload Progress / Success / Error */}
      {isUploading || isComplete || hasError ? (
        <div className="space-y-6">
          <UploadProgressTracker
            filename={filenames || 'Unknown files'}
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
            <label className="text-sm font-medium">Pitch Deck Files</label>
            <FileUploader
              onFilesSelect={handleFilesSelect}
              selectedFiles={selectedFiles}
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
              {isUploading
                ? 'Uploading...'
                : `Upload ${selectedFiles.length} File${selectedFiles.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
