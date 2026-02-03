// Request types for pitch deck API endpoints

export type UploadPitchDeckRequest = {
  file: File;
};

export type AnalyzePitchDeckRequest = {
  uploadId: string;
};

// Pitch deck management request types
export type ListPitchDecksQuery = {
  status?: 'uploading' | 'processing' | 'ready' | 'error';
  limit?: number;
  offset?: number;
};

export type UploadPitchDeckWithMetadataRequest = {
  deck: File;
  title: string;
  description?: string;
  tags?: string[];
};
