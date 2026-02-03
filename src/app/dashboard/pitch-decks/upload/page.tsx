'use client';

import { APP_URL } from '@/constants/routes';
import { ArrowLeft, Upload } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { UploadForm } from '@/components/pitch-deck-management/upload-form';

export default function UploadPitchDeckPage() {
  const router = useRouter();

  const handleSuccess = (_uuid: string) => {
    // Upload successful, navigation handled by form
  };

  const handleCancel = () => {
    router.push(APP_URL.PITCH_DECKS);
  };

  return (
    <div className="container max-w-3xl py-8 px-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link
          href={APP_URL.PITCH_DECKS}
          className="hover:text-foreground transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Pitch Decks
        </Link>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Upload className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Upload New Pitch Deck</h1>
        </div>
        <p className="text-muted-foreground">
          Upload your pitch deck and add metadata for better organization and analysis.
        </p>
      </div>

      {/* Upload Form */}
      <div className="bg-card rounded-lg border p-6">
        <UploadForm onSuccess={handleSuccess} onCancel={handleCancel} />
      </div>

      {/* Help Text */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
        <h3 className="text-sm font-medium mb-2">Upload Guidelines</h3>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Supported formats: PDF, PPT, PPTX, DOC, DOCX, TXT</li>
          <li>Maximum file size: 10MB</li>
          <li>Title is required (max 200 characters)</li>
          <li>Description is optional (max 1000 characters)</li>
          <li>You can add up to 10 tags for better organization</li>
        </ul>
      </div>
    </div>
  );
}
