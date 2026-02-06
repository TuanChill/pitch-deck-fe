/**
 * useSwot Hook
 *
 * Fetches SWOT analysis data for a pitch deck with polling support.
 * Polls every 3 seconds if SWOT not ready (404).
 * Max polling duration: 5 minutes (100 attempts).
 */

import { getSwotByDeck } from '@/services/api';
import type { SwotData } from '@/types/response/swot-response.types';
import { useCallback, useEffect, useRef, useState } from 'react';

type SwotStatus = 'loading' | 'ready' | 'error';

interface UseSwotOptions {
  pollingInterval?: number; // Default 3000ms (3s)
  maxPollDuration?: number; // Default 300000ms (5min)
  enabled?: boolean; // Default true
}

interface UseSwotReturn {
  data: SwotData | null;
  status: SwotStatus;
  error: string | null;
  isPolling: boolean;
  retryCount: number;
  refetch: () => Promise<void>;
}

const POLLING_INTERVAL = 3000; // 3 seconds
const MAX_POLL_DURATION = 300000; // 5 minutes
const MAX_ATTEMPTS = Math.ceil(MAX_POLL_DURATION / POLLING_INTERVAL); // 100 attempts

export const useSwot = (deckId: string | null, options: UseSwotOptions = {}): UseSwotReturn => {
  const {
    pollingInterval = POLLING_INTERVAL,
    maxPollDuration = MAX_POLL_DURATION,
    enabled = true
  } = options;

  const [data, setData] = useState<SwotData | null>(null);
  const [status, setStatus] = useState<SwotStatus>('loading');
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

  const fetchSwot = useCallback(
    async (isPoll = false): Promise<void> => {
      if (!deckId || !enabled || !isMountedRef.current) {
        return;
      }

      // Check if we've exceeded max duration
      if (isPoll && startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed > maxPollDuration) {
          clearPolling();
          setError('SWOT generation timed out after 5 minutes');
          setStatus('error');

          return;
        }
      }

      try {
        const response = await getSwotByDeck(deckId);
        if (!isMountedRef.current) return;

        setData(response.data || null);
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
              setError('SWOT not ready after maximum polling attempts');
              setStatus('error');

              return;
            }

            setIsPolling(true);
            setRetryCount((prev) => prev + 1);
            timeoutRef.current = setTimeout(() => {
              fetchSwot(true);
            }, pollingInterval);

            return;
          }
        }

        // Other errors
        clearPolling();
        setError(err instanceof Error ? err.message : 'Failed to load SWOT');
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
    await fetchSwot();
  }, [fetchSwot]);

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;

    if (deckId && enabled) {
      fetchSwot();
    }

    return () => {
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
