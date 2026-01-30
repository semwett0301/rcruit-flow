/**
 * ConfirmDialog Component
 *
 * A reusable modal confirmation dialog component for destructive or important actions.
 * Displays a warning-styled dialog with customizable title, message, and action buttons.
 */

import React from 'react';

/**
 * Props for the ConfirmDialog component
 */
interface ConfirmDialogProps {
  /** Controls whether the dialog is visible */
  isOpen: boolean;
  /** Callback function when user confirms the action */
  onConfirm: () => void;
  /** Callback function when user cancels the action */
  onCancel: () => void;
  /** Title displayed at the top of the dialog */
  title: string;
  /** Message/description displayed in the dialog body */
  message: string;
}

/**
 * ConfirmDialog - A modal confirmation dialog for reset and other destructive actions
 *
 * @param props - ConfirmDialogProps
 * @returns React component or null if not open
 *
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={showDialog}
 *   onConfirm={handleReset}
 *   onCancel={() => setShowDialog(false)}
 *   title="Reset Settings"
 *   message="Are you sure you want to reset all settings? This action cannot be undone."
 * />
 * ```
 */
const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  // Don't render anything if dialog is not open
  if (!isOpen) {
    return null;
  }

  /**
   * Handle backdrop click to close dialog
   */
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking the backdrop itself, not the dialog content
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  /**
   * Handle keyboard events for accessibility
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div
      className="confirm-dialog-overlay"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
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
        zIndex: 1000,
      }}
    >
      <div
        className="confirm-dialog"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          maxWidth: '400px',
          width: '90%',
          padding: '24px',
          border: '2px solid #f59e0b',
        }}
      >
        {/* Dialog Header */}
        <div
          className="confirm-dialog-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          {/* Warning Icon */}
          <span
            style={{
              fontSize: '24px',
              marginRight: '12px',
              color: '#f59e0b',
            }}
            aria-hidden="true"
          >
            ⚠️
          </span>
          <h2
            id="confirm-dialog-title"
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
              color: '#92400e',
            }}
          >
            {title}
          </h2>
        </div>

        {/* Dialog Body */}
        <p
          id="confirm-dialog-message"
          style={{
            margin: '0 0 24px 0',
            color: '#4b5563',
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>

        {/* Dialog Actions */}
        <div
          className="confirm-dialog-actions"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: '1px solid #d1d5db',
              backgroundColor: '#ffffff',
              color: '#374151',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#b91c1c';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
