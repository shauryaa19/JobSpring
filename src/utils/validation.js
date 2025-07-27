/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  // More comprehensive email regex that rejects consecutive dots and other invalid patterns
  const emailRegex = /^[a-zA-Z0-9]([a-zA-Z0-9._+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
  
  // Additional checks for invalid patterns
  if (email.includes('..') || email.startsWith('.') || email.endsWith('.')) {
    return false;
  }
  
  return emailRegex.test(email);
};

/**
 * Validate phone number format
 * @param {string} phone - The phone number to validate
 * @returns {boolean} True if phone is valid
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  
  // Remove all non-digits
  const digitsOnly = phone.replace(/\D/g, '');
  
  // Check if it's 10 or 11 digits (with or without country code)
  if (digitsOnly.length < 10 || digitsOnly.length > 11) {
    return false;
  }
  
  // Check for common phone number patterns
  // Allow formats like: (555) 123-4567, 555-123-4567, +1 555 123 4567, 5551234567
  const phoneRegex = /^[+]?[1]?[\s]?[(]?[0-9]{3}[)]?[\s]?[0-9]{3}[\s]?[0-9]{4}$/;
  
  // Remove spaces, parentheses, and dashes for regex check
  const cleanPhone = phone.replace(/[\s()\-]/g, '');
  
  return phoneRegex.test(cleanPhone);
};

/**
 * Validate required field
 * @param {any} value - The value to validate
 * @returns {boolean} True if value is not empty
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

/**
 * Validate minimum length
 * @param {string} value - The value to validate
 * @param {number} minLength - Minimum required length
 * @returns {boolean} True if value meets minimum length
 */
export const hasMinLength = (value, minLength) => {
  if (!value) return false;
  return value.length >= minLength;
};

/**
 * Validate maximum length
 * @param {string} value - The value to validate
 * @param {number} maxLength - Maximum allowed length
 * @returns {boolean} True if value is within maximum length
 */
export const hasMaxLength = (value, maxLength) => {
  if (!value) return true; // Empty values are considered valid for max length
  return value.length <= maxLength;
};

/**
 * Validate URL format
 * @param {string} url - The URL to validate
 * @returns {boolean} True if URL is valid
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate that value is a number
 * @param {any} value - The value to validate
 * @returns {boolean} True if value is a valid number
 */
export const isValidNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

/**
 * Validate that value is within a range
 * @param {number} value - The value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {boolean} True if value is within range
 */
export const isInRange = (value, min, max) => {
  const num = parseFloat(value);
  return !isNaN(num) && num >= min && num <= max;
};

/**
 * Create a validation object for forms
 * @param {Object} rules - Validation rules
 * @param {Object} values - Form values to validate
 * @returns {Object} Validation results with errors
 */
export const validateForm = (rules, values) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const fieldRules = rules[field];
    const value = values[field];
    const fieldErrors = [];

    fieldRules.forEach(rule => {
      if (rule.type === 'required' && !isRequired(value)) {
        fieldErrors.push(rule.message || `${field} is required`);
      } else if (rule.type === 'email' && value && !isValidEmail(value)) {
        fieldErrors.push(rule.message || 'Please enter a valid email');
      } else if (rule.type === 'phone' && value && !isValidPhone(value)) {
        fieldErrors.push(rule.message || 'Please enter a valid phone number');
      } else if (rule.type === 'minLength' && value && !hasMinLength(value, rule.value)) {
        fieldErrors.push(rule.message || `Minimum length is ${rule.value} characters`);
      } else if (rule.type === 'maxLength' && value && !hasMaxLength(value, rule.value)) {
        fieldErrors.push(rule.message || `Maximum length is ${rule.value} characters`);
      } else if (rule.type === 'number' && value && !isValidNumber(value)) {
        fieldErrors.push(rule.message || 'Please enter a valid number');
      }
    });

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors.length === 1 ? fieldErrors[0] : fieldErrors;
      isValid = false;
    }
  });

  return { errors, isValid };
}; 