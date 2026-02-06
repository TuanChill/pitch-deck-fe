/**
 * SWOT Error State
 * Error display with retry option
 */

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface SWOTErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function SWOTErrorState({ message, onRetry }: SWOTErrorStateProps) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">SWOT Analysis Failed</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
          {message || 'Unable to generate SWOT analysis. Please try again.'}
        </p>
        <Button onClick={onRetry} variant="outline">
          Retry Analysis
        </Button>
      </CardContent>
    </Card>
  );
}
