/**
 * Custom hook for managing email generation state.
 * Handles loading states, error management, and prevents duplicate requests.
 */
import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Parameters for email generation request
 */
export interface EmailGenerationParams {
  /** The recipient email address */
  to?: string;
  /** Email subject line */
  subject?: string;
  /** Email body content or prompt for generation */
  content?: string;
  /** Additional context or metadata */
  context?: Record<string, unknown>;
  /** Any additional parameters */
  [key: string]: unknown;
}

/**
 * Result from email generation API
 */
export interface EmailGenerationResult {
  /** Generated email content */
  email?: string;
  /** Generated subject line */
  subject?: string;
  /** Any additional response data */
  [key: string]: unknown;
}

/**
 * Options for the useEmailGeneration hook
 */
export interface UseEmailGenerationOptions {
  /** Callback invoked on successful email generation */
  onSuccess?: (result: EmailGenerationResult) => void;
  /** Callback invoked when an error occurs */
  onError?: (error: Error) => void;
}

/**
 * Return type for the useEmailGeneration hook
 */
export interface UseEmailGenerationReturn {
  /** Whether a generation request is currently in progress */
  isLoading: boolean;
  /** The most recent error, if any */
  error: Error | null;
  /** Function to trigger email generation */
  generateEmail: (params: EmailGenerationParams) => Promise<void>;
  /** Function to clear the current error state */
  clearError: () => void;
  /** Function to cancel the current request */
  cancelRequest: () => void;
}

/**
 * Custom hook to manage email generation state including loading, error,
 * and preventing duplicate requests.
 *
 * @param options - Configuration options for the hook
 * @returns Object containing state and control functions
 *
 * @example
 * ```tsx
 * const { isLoading, error, generateEmail, clearError } = useEmailGeneration({
 *   onSuccess: (result) => console.log('Generated:', result),
 *   onError: (error) => console.error('Failed:', error),
 * });
 *
 * const handleGenerate = () => {
 *   generateEmail({ subject: 'Hello', content: 'Write a professional email...' });
 * };
 * ```
 */
export const useEmailGeneration = (
  options: UseEmailGenerationOptions = {}
): UseEmailGenerationReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Store options in a ref to avoid dependency issues in useCallback
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  /**
   * Cancels the current in-progress request, if any
   */
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  /**
   * Triggers email generation with the provided parameters.
   * Prevents duplicate requests while one is in progress.
   *
   * @param params - Parameters for the email generation request
   */
  const generateEmail = useCallback(async (params: EmailGenerationParams): Promise<void> => {
    // Prevent duplicate requests
    if (abortControllerRef.current) {
      console.warn('Email generation already in progress');
      return;
    }

    setIsLoading(true);
    setError(null);
    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch('/api/email/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorMessage = await response.text().catch(() => response.statusText);
        throw new Error(`Email generation failed: ${errorMessage || response.statusText}`);
      }

      const result: EmailGenerationResult = await response.json();
      optionsRef.current.onSuccess?.(result);
    } catch (err) {
      // Don't treat abort errors as failures
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      const error = err instanceof Error ? err : new Error('Unknown error occurred');
      setError(error);
      optionsRef.current.onError?.(error);
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * Clears the current error state
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    generateEmail,
    clearError,
    cancelRequest,
  };
};

export default useEmailGeneration;
