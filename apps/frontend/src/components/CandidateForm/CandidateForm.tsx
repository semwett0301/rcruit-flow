import React, { useState, useCallback } from 'react';
import { ConfirmationDialog } from '../ConfirmationDialog/ConfirmationDialog';
import { useFormReset } from '../../hooks/useFormReset';

/**
 * Initial state for the candidate form fields
 */
const INITIAL_FORM_STATE = {
  name: '',
  email: '',
  phone: '',
  position: '',
  experience: '',
  coverLetter: '',
};

/**
 * Initial state for validation errors
 */
const INITIAL_ERRORS_STATE = {
  name: '',
  email: '',
  phone: '',
  position: '',
  experience: '',
  coverLetter: '',
  cv: '',
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  coverLetter: string;
}

interface FormErrors {
  name: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  coverLetter: string;
  cv: string;
}

interface CandidateFormProps {
  /** Callback function called when form is successfully submitted */
  onSubmit?: (data: FormData & { cv: File | null }) => void;
  /** Optional CSS class name for styling */
  className?: string;
}

/**
 * CandidateForm Component
 * 
 * A form component for collecting candidate application data including
 * personal information, experience, and CV upload.
 * 
 * Features:
 * - Form validation
 * - CV file upload with preview
 * - Reset functionality with confirmation dialog
 */
export const CandidateForm: React.FC<CandidateFormProps> = ({
  onSubmit,
  className = '',
}) => {
  // Form field state
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_STATE);
  
  // CV file state
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvPreview, setCvPreview] = useState<string>('');
  
  // Validation errors state
  const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS_STATE);
  
  // Loading state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Resets all form fields to their initial state
   * Clears form data, CV file, preview, and validation errors
   */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setCvFile(null);
    setCvPreview('');
    setErrors(INITIAL_ERRORS_STATE);
  }, []);

  // Use the form reset hook with confirmation dialog
  const {
    isDialogOpen,
    requestReset,
    confirmReset,
    cancelReset,
  } = useFormReset(resetForm);

  /**
   * Handles input field changes
   */
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Clear error for this field when user starts typing
      if (errors[name as keyof FormErrors]) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }
    },
    [errors]
  );

  /**
   * Handles CV file upload
   */
  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      setCvFile(file);
      
      if (file) {
        setCvPreview(file.name);
        // Clear CV error when file is selected
        if (errors.cv) {
          setErrors((prev) => ({
            ...prev,
            cv: '',
          }));
        }
      } else {
        setCvPreview('');
      }
    },
    [errors.cv]
  );

  /**
   * Validates the form and returns whether it's valid
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = { ...INITIAL_ERRORS_STATE };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [formData]);

  /**
   * Handles form submission
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      setIsSubmitting(true);

      try {
        if (onSubmit) {
          await onSubmit({
            ...formData,
            cv: cvFile,
          });
        }
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, cvFile, validateForm, onSubmit]
  );

  /**
   * Handles the reset button click - triggers confirmation dialog
   */
  const handleResetClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      requestReset();
    },
    [requestReset]
  );

  return (
    <>
      <form
        className={`candidate-form ${className}`}
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="candidate-form__header">
          <h2>Candidate Application</h2>
        </div>

        <div className="candidate-form__body">
          {/* Name Field */}
          <div className="candidate-form__field">
            <label htmlFor="name" className="candidate-form__label">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`candidate-form__input ${errors.name ? 'candidate-form__input--error' : ''}`}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            {errors.name && (
              <span className="candidate-form__error">{errors.name}</span>
            )}
          </div>

          {/* Email Field */}
          <div className="candidate-form__field">
            <label htmlFor="email" className="candidate-form__label">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`candidate-form__input ${errors.email ? 'candidate-form__input--error' : ''}`}
              placeholder="Enter your email address"
              disabled={isSubmitting}
            />
            {errors.email && (
              <span className="candidate-form__error">{errors.email}</span>
            )}
          </div>

          {/* Phone Field */}
          <div className="candidate-form__field">
            <label htmlFor="phone" className="candidate-form__label">
              Phone Number *
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={`candidate-form__input ${errors.phone ? 'candidate-form__input--error' : ''}`}
              placeholder="Enter your phone number"
              disabled={isSubmitting}
            />
            {errors.phone && (
              <span className="candidate-form__error">{errors.phone}</span>
            )}
          </div>

          {/* Position Field */}
          <div className="candidate-form__field">
            <label htmlFor="position" className="candidate-form__label">
              Position Applied For *
            </label>
            <input
              type="text"
              id="position"
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className={`candidate-form__input ${errors.position ? 'candidate-form__input--error' : ''}`}
              placeholder="Enter the position you're applying for"
              disabled={isSubmitting}
            />
            {errors.position && (
              <span className="candidate-form__error">{errors.position}</span>
            )}
          </div>

          {/* Experience Field */}
          <div className="candidate-form__field">
            <label htmlFor="experience" className="candidate-form__label">
              Years of Experience
            </label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="candidate-form__input candidate-form__select"
              disabled={isSubmitting}
            >
              <option value="">Select experience level</option>
              <option value="0-1">0-1 years</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5-10">5-10 years</option>
              <option value="10+">10+ years</option>
            </select>
          </div>

          {/* Cover Letter Field */}
          <div className="candidate-form__field">
            <label htmlFor="coverLetter" className="candidate-form__label">
              Cover Letter
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              className="candidate-form__input candidate-form__textarea"
              placeholder="Tell us about yourself and why you're interested in this position"
              rows={5}
              disabled={isSubmitting}
            />
          </div>

          {/* CV Upload Field */}
          <div className="candidate-form__field">
            <label htmlFor="cv" className="candidate-form__label">
              Upload CV
            </label>
            <div className="candidate-form__file-upload">
              <input
                type="file"
                id="cv"
                name="cv"
                onChange={handleFileChange}
                className="candidate-form__file-input"
                accept=".pdf,.doc,.docx"
                disabled={isSubmitting}
              />
              <label htmlFor="cv" className="candidate-form__file-label">
                {cvPreview || 'Choose a file (PDF, DOC, DOCX)'}
              </label>
            </div>
            {cvPreview && (
              <div className="candidate-form__file-preview">
                <span className="candidate-form__file-name">{cvPreview}</span>
                <button
                  type="button"
                  className="candidate-form__file-remove"
                  onClick={() => {
                    setCvFile(null);
                    setCvPreview('');
                  }}
                  disabled={isSubmitting}
                  aria-label="Remove uploaded file"
                >
                  ×
                </button>
              </div>
            )}
            {errors.cv && (
              <span className="candidate-form__error">{errors.cv}</span>
            )}
          </div>
        </div>

        <div className="candidate-form__footer">
          {/* Reset Button - Secondary/Outline Style */}
          <button
            type="button"
            className="candidate-form__button candidate-form__button--secondary"
            onClick={handleResetClick}
            disabled={isSubmitting}
          >
            Clear Form
          </button>

          {/* Submit Button - Primary Style */}
          <button
            type="submit"
            className="candidate-form__button candidate-form__button--primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>

      {/* Confirmation Dialog for Reset */}
      <ConfirmationDialog
        isOpen={isDialogOpen}
        title="Clear Form"
        message="Are you sure you want to clear all form data? This action cannot be undone."
        confirmLabel="Clear"
        cancelLabel="Cancel"
        onConfirm={confirmReset}
        onCancel={cancelReset}
        variant="warning"
      />
    </>
  );
};

export default CandidateForm;
