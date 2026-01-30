/**
 * ConfirmationDialog Component
 *
 * A reusable modal dialog component for confirmation actions.
 * Features:
 * - React portal rendering for proper z-index stacking
 * - Accessible keyboard navigation (Escape to close, focus trap)
 * - Visual variants for different action types (danger, warning, info)
 * - Customizable labels and content
 */

import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface ConfirmationDialogProps {
  /** Controls whether the dialog is visible */
  isOpen: boolean;
  /** Dialog title text */
  title: string;
  /** Dialog message/description */
  message: string;
  /** Label for the confirm button */
  confirmLabel?: string;
  /** Label for the cancel button */
  cancelLabel?: string;
  /** Callback fired when user confirms the action */
  onConfirm: () => void;
  /** Callback fired when user cancels or closes the dialog */
  onCancel: () => void;
  /** Visual variant affecting the confirm button styling */
  variant?: 'danger' | 'warning' | 'info';
}

/**
 * ConfirmationDialog - A modal dialog for confirming user actions
 *
 * @example
 * ```tsx
 * <ConfirmationDialog
 *   isOpen={showDialog}
 *   title="Reset Settings"
 *   message="Are you sure you want to reset all settings?"
 *   variant="danger"
 *   onConfirm={handleReset}
 *   onCancel={() => setShowDialog(false)}
 * />
 * ```
 */
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'info',
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  /**
   * Handle keyboard events for accessibility
   * - Escape key closes the dialog
   * - Tab key is trapped within the dialog
   */
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCancel();
        return;
      }

      // Focus trap implementation
      if (event.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          // Shift + Tab: move focus backwards
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: move focus forwards
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [onCancel]
  );

  // Set up event listeners and focus management
  useEffect(() => {
    if (isOpen) {
      // Store the currently focused element to restore later
      previousActiveElement.current = document.activeElement as HTMLElement;

      // Add keyboard event listener
      document.addEventListener('keydown', handleKeyDown);

      // Focus the cancel button by default (safer option)
      setTimeout(() => {
        cancelButtonRef.current?.focus();
      }, 0);

      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';

      // Restore focus to the previously focused element
      if (previousActiveElement.current && !isOpen) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, handleKeyDown]);

  /**
   * Handle backdrop click to close dialog
   */
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  /**
   * Get variant-specific styles for the confirm button
   */
  const getConfirmButtonStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      padding: '10px 20px',
      borderRadius: '6px',
      border: 'none',
      fontWeight: 600,
      fontSize: '14px',
      cursor: 'pointer',
      transition: 'background-color 0.2s ease, transform 0.1s ease',
      minWidth: '100px',
    };

    switch (variant) {
      case 'danger':
        return {
          ...baseStyles,
          backgroundColor: '#dc2626',
          color: '#ffffff',
        };
      case 'warning':
        return {
          ...baseStyles,
          backgroundColor: '#f59e0b',
          color: '#000000',
        };
      case 'info':
      default:
        return {
          ...baseStyles,
          backgroundColor: '#2563eb',
          color: '#ffffff',
        };
    }
  };

  // Don't render anything if dialog is closed
  if (!isOpen) {
    return null;
  }

  const dialogContent = (
    <div
      className="confirmation-dialog-overlay"
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '20px',
      }}
      role="presentation"
    >
      <div
        ref={dialogRef}
        className="confirmation-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-message"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          maxWidth: '450px',
          width: '100%',
          padding: '24px',
          animation: 'dialogFadeIn 0.2s ease-out',
        }}
      >
        {/* Dialog Header */}
        <h2
          id="confirmation-dialog-title"
          style={{
            margin: '0 0 12px 0',
            fontSize: '18px',
            fontWeight: 600,
            color: '#111827',
            lineHeight: 1.4,
          }}
        >
          {title}
        </h2>

        {/* Dialog Message */}
        <p
          id="confirmation-dialog-message"
          style={{
            margin: '0 0 24px 0',
            fontSize: '14px',
            color: '#6b7280',
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>

        {/* Dialog Actions */}
        <div
          className="confirmation-dialog-actions"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            ref={cancelButtonRef}
            type="button"
            onClick={onCancel}
            className="confirmation-dialog-cancel-btn"
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#374151',
              fontWeight: 500,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
              minWidth: '100px',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.borderColor = '#9ca3af';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#d1d5db';
            }}
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmButtonRef}
            type="button"
            onClick={onConfirm}
            className="confirmation-dialog-confirm-btn"
            style={getConfirmButtonStyles()}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      {/* Inline keyframe animation styles */}
      <style>
        {`
          @keyframes dialogFadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );

  // Render using React Portal to ensure proper stacking context
  return createPortal(dialogContent, document.body);
};

export default ConfirmationDialog;
