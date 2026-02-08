'use client';

import type { DeckCurrentStep } from '@/constants/pitch-deck-status';
import { Info } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface PipelineRunningBannerProps {
  currentStep?: DeckCurrentStep;
}

/**
 * Pipeline Running Banner
 *
 * Displays info banner when AI pipeline is not done.
 * Shows when currentStep !== 'done', hides otherwise.
 */
export function PipelineRunningBanner({ currentStep }: PipelineRunningBannerProps) {
  if (currentStep === 'done') {
    return null;
  }

  return (
    <Alert variant="default">
      <Info className="h-4 w-4" />
      <AlertTitle>Processing in progress</AlertTitle>
      <AlertDescription>
        Content generation may take a while. We&apos;re cooking your content.
      </AlertDescription>
    </Alert>
  );
}
