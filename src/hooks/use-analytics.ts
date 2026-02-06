/**
 * useAnalytics Hook
 *
 * Fetches analytics data for a pitch deck with polling support.
 * Polls every 3 seconds if analytics not ready (404).
 * Max polling duration: 5 minutes (100 attempts).
 */

import { getAnalytics } from '@/services/api';
import type { VcFeedbackResponse } from '@/types/domain/vc-feedback';
import { useCallback, useEffect, useRef, useState } from 'react';

type AnalyticsStatus = 'loading' | 'ready' | 'error';

interface UseAnalyticsOptions {
  pollingInterval?: number; // Default 3000ms (3s)
  maxPollDuration?: number; // Default 300000ms (5min)
  enabled?: boolean; // Default true
}

interface UseAnalyticsReturn {
  data: VcFeedbackResponse | null;
  status: AnalyticsStatus;
  error: string | null;
  isPolling: boolean;
  retryCount: number;
  refetch: () => Promise<void>;
}

const POLLING_INTERVAL = 3000; // 3 seconds
const MAX_POLL_DURATION = 300000; // 5 minutes
const MAX_ATTEMPTS = Math.ceil(MAX_POLL_DURATION / POLLING_INTERVAL); // 100 attempts

export const useAnalytics = (
  deckId: string | null,
  options: UseAnalyticsOptions = {}
): UseAnalyticsReturn => {
  const {
    pollingInterval = POLLING_INTERVAL,
    maxPollDuration = MAX_POLL_DURATION,
    enabled = true
  } = options;

  const [data, setData] = useState<VcFeedbackResponse | null>(null);
  const [status, setStatus] = useState<AnalyticsStatus>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isMountedRef = useRef(true);

  const clearPolling = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPolling(false);
  }, []);

  const fetchAnalytics = useCallback(
    async (isPoll = false): Promise<void> => {
      if (!deckId || !enabled || !isMountedRef.current) return;

      // Check if we've exceeded max duration
      if (isPoll && startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed > maxPollDuration) {
          clearPolling();
          setError('Analytics generation timed out after 5 minutes');
          setStatus('error');

          return;
        }
      }

      try {
        const response = await getAnalytics(deckId);
        if (!isMountedRef.current) return;

        setIsPolling(false);
        setData(response);
        setStatus('ready');
        setError(null);
        clearPolling();
      } catch (err) {
        if (!isMountedRef.current) return;

        // Check if 404 (not ready) - poll
        if (err && typeof err === 'object' && 'response' in err) {
          const axiosError = err as { response?: { status?: number } };
          if (axiosError.response?.status === 404) {
            // Not ready, start polling
            if (!isPoll) {
              startTimeRef.current = Date.now();
            }

            // Check retry limit
            if (retryCount >= MAX_ATTEMPTS - 1) {
              clearPolling();
              setError('Analytics not ready after maximum polling attempts');
              setStatus('error');

              return;
            }

            setIsPolling(true);
            setRetryCount((prev) => prev + 1);
            timeoutRef.current = setTimeout(() => {
              fetchAnalytics(true);
            }, pollingInterval);

            return;
          }
        }

        // Other errors
        clearPolling();
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
        setStatus('error');
      }
    },
    [deckId, enabled, retryCount, pollingInterval, maxPollDuration, clearPolling]
  );

  const refetch = useCallback(async () => {
    setRetryCount(0);
    setError(null);
    setStatus('loading');
    startTimeRef.current = null;
    await fetchAnalytics();
  }, [fetchAnalytics]);

  // Initial fetch
  useEffect(() => {
    if (deckId && enabled) {
      fetchAnalytics();
    }

    return () => {
      // Set mounted flag FIRST to prevent any state updates
      isMountedRef.current = false;
      clearPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckId, enabled]); // Only re-run if deckId or enabled changes

  return {
    data,
    status,
    error,
    isPolling,
    retryCount,
    refetch
  };
};
