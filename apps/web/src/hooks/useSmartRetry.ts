
import { useState, useCallback } from 'react';

interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  onRetry?: (attempt: number, error: Error) => void;
}

export function useSmartRetry<T>(options: RetryOptions = {}) {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    maxDelay = 10000,
    onRetry
  } = options;

  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const executeWithRetry = useCallback(
    async (fn: () => Promise<T>): Promise<T> => {
      let lastError: Error | null = null;

      for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
          if (attempt > 0) {
            setIsRetrying(true);
            setRetryCount(attempt);
            
            // Exponential backoff with jitter
            const delay = Math.min(
              baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000,
              maxDelay
            );
            
            await new Promise(resolve => setTimeout(resolve, delay));
            
            onRetry?.(attempt, lastError!);
          }

          const result = await fn();
          
          setIsRetrying(false);
          setRetryCount(0);
          
          return result;
        } catch (error) {
          lastError = error as Error;
          
          // Don't retry on certain errors
          if (error instanceof Error) {
            if (error.message.includes('401') || error.message.includes('403')) {
              throw error; // Auth errors shouldn't be retried
            }
          }

          if (attempt === maxRetries) {
            setIsRetrying(false);
            setRetryCount(0);
            throw lastError;
          }
        }
      }

      throw lastError!;
    },
    [maxRetries, baseDelay, maxDelay, onRetry]
  );

  return {
    executeWithRetry,
    isRetrying,
    retryCount
  };
}
