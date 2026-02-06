/**
 * Analytics Error State
 * Shows when analytics data fails to load
 */

import { AlertCircle, RefreshCw } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface AnalyticsErrorProps {
  error: string | null;
  onRetry?: () => void;
  isPolling?: boolean;
}

export function AnalyticsError({ error, onRetry, isPolling = false }: AnalyticsErrorProps) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Failed to Load Analytics</AlertTitle>
      <AlertDescription className="space-y-4">
        <p>{error || 'An unknown error occurred while loading analytics data.'}</p>

        {isPolling && <p className="text-sm opacity-80">Still polling for analytics data...</p>}

        {onRetry && !isPolling && (
          <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
