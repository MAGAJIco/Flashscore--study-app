
interface RetryOptions {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableErrors?: (error: any) => boolean;
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxAttempts: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
  retryableErrors: (error) => {
    // Retry on network errors and 5xx server errors
    if (!error.status) return true; // Network error
    return error.status >= 500 && error.status < 600;
  },
};

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const opts = { ...DEFAULT_RETRY_OPTIONS, ...options };
  let lastError: any;
  let delay = opts.initialDelay;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if error is not retryable
      if (opts.retryableErrors && !opts.retryableErrors(error)) {
        throw error;
      }

      // Don't retry on last attempt
      if (attempt === opts.maxAttempts) {
        break;
      }

      console.warn(`⚠️ Attempt ${attempt}/${opts.maxAttempts} failed, retrying in ${delay}ms...`, error);

      await sleep(delay);

      // Exponential backoff with jitter
      delay = Math.min(
        delay * opts.backoffMultiplier + Math.random() * 1000,
        opts.maxDelay
      );
    }
  }

  console.error(`❌ All ${opts.maxAttempts} attempts failed`);
  throw lastError;
}
