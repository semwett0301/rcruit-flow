/**
 * LoadingSpinner Component
 *
 * A reusable loading spinner component with configurable size and optional message.
 * Uses Tailwind CSS for styling and includes proper accessibility attributes.
 */
import React from 'react';

interface LoadingSpinnerProps {
  /** Size of the spinner: 'sm' (16px), 'md' (32px), or 'lg' (48px) */
  size?: 'sm' | 'md' | 'lg';
  /** Optional message to display below the spinner */
  message?: string;
  /** Additional CSS classes to apply to the container */
  className?: string;
}

/**
 * LoadingSpinner - A customizable loading indicator component
 *
 * @example
 * // Basic usage
 * <LoadingSpinner />
 *
 * @example
 * // With size and message
 * <LoadingSpinner size="lg" message="Loading data..." />
 *
 * @example
 * // With custom className
 * <LoadingSpinner className="my-8" />
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message,
  className = '',
}) => {
  const sizeClasses: Record<'sm' | 'md' | 'lg', string> = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin`}
        role="status"
        aria-label="Loading"
      />
      {message && (
        <p className="text-sm text-gray-600" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
