// Retry utility with exponential backoff and jitter
// Prevents retry storms and handles transient failures

export type RetryOptions = {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
};

const DEFAULT_RETRY_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 30000
};

// Exponential backoff with jitter (random delay to prevent retry storms)
export const withRetry = async <T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === opts.maxRetries) {
        throw error;
      }

      // Exponential backoff: baseDelay * 2^attempt + random jitter (0-1000ms)
      const exponentialDelay = opts.baseDelay * Math.pow(2, attempt);
      const jitter = Math.random() * 1000;
      const delay = Math.min(exponentialDelay + jitter, opts.maxDelay);

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw new Error('Max retries exceeded');
};
