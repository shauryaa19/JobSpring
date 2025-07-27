import React from 'react';
import { Save, Loader2, AlertCircle } from 'lucide-react';
import { Modal } from '../ui';
import { isValidEmail, isValidPhone, isRequired } from '../../utils';

const EditProfileModal = ({
  isOpen,
  onClose,
  formData,
  onFormChange,
  onSave,
  isSaving,
  error
}) => {
  const handleInputChange = (field, value) => {
    onFormChange(field, value);
  };

  const isFormValid = () => {
    return (
      isRequired(formData.name) &&
      isRequired(formData.title) &&
      isValidEmail(formData.email) &&
      isValidPhone(formData.phone) &&
      isRequired(formData.location)
    );
  };

  const getFieldError = (field) => {
    const value = formData[field] || '';
    
    switch (field) {
      case 'name':
        return !isRequired(value) ? 'Full name is required' : '';
      case 'title':
        return !isRequired(value) ? 'Job title is required' : '';
      case 'email':
        return !isValidEmail(value) ? 'Please enter a valid email address' : '';
      case 'phone':
        return !isValidPhone(value) ? 'Please enter a valid phone number' : '';
      case 'location':
        return !isRequired(value) ? 'Location is required' : '';
      default:
        return '';
    }
  };

  const modalFooter = (
    <>
      <button 
        className="btn btn-secondary" 
        onClick={onClose}
        disabled={isSaving}
      >
        Cancel
      </button>
      <button 
        className="btn btn-primary"
        onClick={onSave}
        disabled={isSaving || !isFormValid()}
      >
        {isSaving ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save size={16} />
            Save Changes
          </>
        )}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      footer={modalFooter}
      size="large"
    >
      {error && (
        <div className="error-message">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Full Name *</label>
        <input
          type="text"
          id="name"
          value={formData.name || ''}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Enter your full name"
          className={getFieldError('name') ? 'error' : ''}
        />
        {getFieldError('name') && (
          <div className="field-error">
            <AlertCircle size={14} />
            <span>{getFieldError('name')}</span>
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="title">Job Title *</label>
        <input
          type="text"
          id="title"
          value={formData.title || ''}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="e.g., Senior Frontend Developer"
          className={getFieldError('title') ? 'error' : ''}
        />
        {getFieldError('title') && (
          <div className="field-error">
            <AlertCircle size={14} />
            <span>{getFieldError('title')}</span>
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email *</label>
          <input
            type="email"
            id="email"
            value={formData.email || ''}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="your.email@example.com"
            className={getFieldError('email') ? 'error' : ''}
          />
          {getFieldError('email') && (
            <div className="field-error">
              <AlertCircle size={14} />
              <span>{getFieldError('email')}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone *</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone || ''}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className={getFieldError('phone') ? 'error' : ''}
          />
          {getFieldError('phone') && (
            <div className="field-error">
              <AlertCircle size={14} />
              <span>{getFieldError('phone')}</span>
            </div>
          )}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="location">Location *</label>
          <input
            type="text"
            id="location"
            value={formData.location || ''}
            onChange={(e) => handleInputChange('location', e.target.value)}
            placeholder="City, State"
            className={getFieldError('location') ? 'error' : ''}
          />
          {getFieldError('location') && (
            <div className="field-error">
              <AlertCircle size={14} />
              <span>{getFieldError('location')}</span>
            </div>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience</label>
          <input
            type="text"
            id="experience"
            value={formData.experience || ''}
            onChange={(e) => handleInputChange('experience', e.target.value)}
            placeholder="e.g., 5 years"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="education">Education</label>
        <input
          type="text"
          id="education"
          value={formData.education || ''}
          onChange={(e) => handleInputChange('education', e.target.value)}
          placeholder="e.g., BS Computer Science, University Name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          value={formData.bio || ''}
          onChange={(e) => handleInputChange('bio', e.target.value)}
          placeholder="Tell us about yourself, your experience, and what you're looking for..."
          rows={4}
        />
      </div>
    </Modal>
  );
};

export default EditProfileModal; 