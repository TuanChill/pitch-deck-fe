/**
 * usePestle Hook
 *
 * Fetches PESTLE analysis data for a pitch deck with polling support.
 * Polls every 3 seconds if PESTLE not ready (404).
 * Max polling duration: 5 minutes (100 attempts).
 */

import { getPestleByDeck } from '@/services/api';
import type { PestleData } from '@/types/response/pestle-response.types';
import { useCallback, useEffect, useRef, useState } from 'react';

type PestleStatus = 'loading' | 'ready' | 'error';

interface UsePestleOptions {
  pollingInterval?: number; // Default 3000ms (3s)
  maxPollDuration?: number; // Default 300000ms (5min)
  enabled?: boolean; // Default true
}

interface UsePestleReturn {
  data: PestleData | null;
  status: PestleStatus;
  error: string | null;
  isPolling: boolean;
  retryCount: number;
  refetch: () => Promise<void>;
}

const POLLING_INTERVAL = 3000; // 3 seconds
const MAX_POLL_DURATION = 300000; // 5 minutes
const MAX_ATTEMPTS = Math.ceil(MAX_POLL_DURATION / POLLING_INTERVAL); // 100 attempts

export const usePestle = (
  deckId: string | null,
  options: UsePestleOptions = {}
): UsePestleReturn => {
  const {
    pollingInterval = POLLING_INTERVAL,
    maxPollDuration = MAX_POLL_DURATION,
    enabled = true
  } = options;

  const [data, setData] = useState<PestleData | null>(null);
  const [status, setStatus] = useState<PestleStatus>('loading');
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

  const fetchPestle = useCallback(
    async (isPoll = false): Promise<void> => {
      if (!deckId || !enabled || !isMountedRef.current) {
        return;
      }

      // Check if we've exceeded max duration
      if (isPoll && startTimeRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed > maxPollDuration) {
          clearPolling();
          setError('PESTLE generation timed out after 5 minutes');
          setStatus('error');

          return;
        }
      }

      try {
        const response = await getPestleByDeck(deckId);
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
              setError('PESTLE not ready after maximum polling attempts');
              setStatus('error');

              return;
            }

            setIsPolling(true);
            setRetryCount((prev) => prev + 1);
            timeoutRef.current = setTimeout(() => {
              fetchPestle(true);
            }, pollingInterval);

            return;
          }
        }

        // Other errors
        clearPolling();
        setError(err instanceof Error ? err.message : 'Failed to load PESTLE');
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
    await fetchPestle();
  }, [fetchPestle]);

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;

    if (deckId && enabled) {
      fetchPestle();
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
