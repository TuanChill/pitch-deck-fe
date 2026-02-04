// File type validation constants for pitch deck uploads

export const ALLOWED_PITCH_DECK_TYPES = [
  'application/pdf',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-word',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
] as const;

export const MAX_PITCH_DECK_SIZE = 50 * 1024 * 1024;

export const FILE_TYPE_LABELS: Record<string, string> = {
  'application/pdf': 'PDF',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'application/vnd.ms-word': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'text/plain': 'TXT'
};

export const ALLOWED_FILE_EXTENSIONS = ['.pdf', '.ppt', '.pptx', '.doc', '.docx', '.txt'] as const;

export const validatePitchDeckFile = (file: File): { valid: boolean; error?: string } => {
  if (!ALLOWED_PITCH_DECK_TYPES.includes(file.type as never)) {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_FILE_EXTENSIONS.includes(ext as never)) {
      return {
        valid: false,
        error: 'Invalid file type. Allowed: PDF, PPT, PPTX, DOC, DOCX, TXT'
      };
    }
  }

  if (file.size > MAX_PITCH_DECK_SIZE) {
    return {
      valid: false,
      error: `File too large. Max size: ${MAX_PITCH_DECK_SIZE / 1024 / 1024}MB`
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty'
    };
  }

  return { valid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

export const getFileTypeLabel = (file: File): string => {
  return FILE_TYPE_LABELS[file.type] || file.name.split('.').pop()?.toUpperCase() || 'FILE';
};
