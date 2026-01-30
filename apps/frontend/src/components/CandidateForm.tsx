import React, { useState, useCallback } from 'react';
import { useFormReset } from '../hooks/useFormReset';
import { ConfirmDialog } from './ConfirmDialog';

/**
 * Interface for candidate form field values
 */
interface CandidateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  skills: string;
  coverLetter: string;
}

/**
 * Interface for form validation errors
 */
interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  position?: string;
  experience?: string;
  skills?: string;
  coverLetter?: string;
}

/**
 * Initial empty state for all form fields
 */
const initialFormState: CandidateFormData = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  position: '',
  experience: '',
  skills: '',
  coverLetter: '',
};

/**
 * CandidateForm component for collecting candidate application information
 * Includes form validation, file upload, and reset functionality
 */
export const CandidateForm: React.FC = () => {
  // Form data state
  const [formData, setFormData] = useState<CandidateFormData>(initialFormState);
  
  // Uploaded CV file state
  const [cvFile, setCvFile] = useState<File | null>(null);
  
  // Validation errors state
  const [errors, setErrors] = useState<FormErrors>({});
  
  // Toast notification state
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  /**
   * Displays a toast notification with the given message
   */
  const showNotification = useCallback((message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  }, []);

  /**
   * Resets the form to its initial state
   * Clears all form fields, uploaded file, and validation errors
   */
  const resetForm = useCallback(() => {
    // Reset all form fields to initial empty state
    setFormData(initialFormState);
    
    // Clear uploaded CV file
    setCvFile(null);
    
    // Clear all validation errors
    setErrors({});
    
    // Show notification that form was reset
    showNotification('Form has been cleared successfully');
  }, [showNotification]);

  // Initialize the form reset hook with confirmation dialog
  const {
    isConfirmOpen,
    openConfirmDialog,
    closeConfirmDialog,
    confirmReset,
  } = useFormReset({ onReset: resetForm });

  /**
   * Handles input field changes
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  /**
   * Handles CV file upload
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCvFile(file);
  };

  /**
   * Validates the form and returns true if valid
   */
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handles form submission
   */
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Process form submission
      console.log('Form submitted:', { ...formData, cvFile });
      showNotification('Application submitted successfully!');
    }
  };

  return (
    <div className="candidate-form-container">
      <form onSubmit={handleSubmit} className="candidate-form">
        <h2>Candidate Application Form</h2>
        
        {/* First Name */}
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className={errors.firstName ? 'error' : ''}
          />
          {errors.firstName && <span className="error-message">{errors.firstName}</span>}
        </div>
        
        {/* Last Name */}
        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className={errors.lastName ? 'error' : ''}
          />
          {errors.lastName && <span className="error-message">{errors.lastName}</span>}
        </div>
        
        {/* Email */}
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        {/* Phone */}
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>
        
        {/* Position */}
        <div className="form-group">
          <label htmlFor="position">Position Applied For *</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className={errors.position ? 'error' : ''}
          />
          {errors.position && <span className="error-message">{errors.position}</span>}
        </div>
        
        {/* Experience */}
        <div className="form-group">
          <label htmlFor="experience">Years of Experience</label>
          <input
            type="text"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
          />
        </div>
        
        {/* Skills */}
        <div className="form-group">
          <label htmlFor="skills">Skills</label>
          <textarea
            id="skills"
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            rows={3}
            placeholder="List your relevant skills..."
          />
        </div>
        
        {/* Cover Letter */}
        <div className="form-group">
          <label htmlFor="coverLetter">Cover Letter</label>
          <textarea
            id="coverLetter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleInputChange}
            rows={5}
            placeholder="Tell us why you're interested in this position..."
          />
        </div>
        
        {/* CV Upload */}
        <div className="form-group">
          <label htmlFor="cvFile">Upload CV</label>
          <input
            type="file"
            id="cvFile"
            name="cvFile"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
          {cvFile && <span className="file-name">Selected: {cvFile.name}</span>}
        </div>
        
        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            onClick={openConfirmDialog}
            className="reset-button"
          >
            Clear Form
          </button>
          <button type="submit" className="submit-button">
            Submit Application
          </button>
        </div>
      </form>
      
      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          {toastMessage}
        </div>
      )}
      
      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onConfirm={confirmReset}
        onCancel={closeConfirmDialog}
        title="Clear Form?"
        message="This will remove all entered information and uploaded files. Are you sure?"
      />
    </div>
  );
};

export default CandidateForm;
