import {
  isValidEmail,
  isValidPhone,
  isRequired,
  hasMinLength,
  hasMaxLength,
  isValidUrl,
  isValidNumber,
  isInRange,
  validateForm
} from '../validation';

describe('Validation Utilities', () => {
  describe('isValidEmail', () => {
    it('should validate correct email formats', () => {
      expect(isValidEmail('user@example.com')).toBe(true);
      expect(isValidEmail('test.user@company.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
      expect(isValidEmail('user123@test-domain.com')).toBe(true);
    });

    it('should reject invalid email formats', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
      expect(isValidEmail('user..name@example.com')).toBe(false);
    });

    it('should handle empty or null values', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should validate correct phone formats', () => {
      expect(isValidPhone('1234567890')).toBe(true);
      expect(isValidPhone('12345678901')).toBe(true);
      expect(isValidPhone('+1 (555) 123-4567')).toBe(true);
      expect(isValidPhone('555-123-4567')).toBe(true);
      expect(isValidPhone('(555) 123-4567')).toBe(true);
    });

    it('should reject invalid phone formats', () => {
      expect(isValidPhone('123')).toBe(false);
      expect(isValidPhone('123456789')).toBe(false);
      expect(isValidPhone('123456789012')).toBe(false);
      expect(isValidPhone('abcd123456')).toBe(false);
    });

    it('should handle empty or null values', () => {
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone(null)).toBe(false);
      expect(isValidPhone(undefined)).toBe(false);
    });
  });

  describe('isRequired', () => {
    it('should validate required string values', () => {
      expect(isRequired('hello')).toBe(true);
      expect(isRequired('  hello  ')).toBe(true);
    });

    it('should reject empty string values', () => {
      expect(isRequired('')).toBe(false);
      expect(isRequired('   ')).toBe(false);
    });

    it('should validate required array values', () => {
      expect(isRequired([1, 2, 3])).toBe(true);
      expect(isRequired(['hello'])).toBe(true);
    });

    it('should reject empty array values', () => {
      expect(isRequired([])).toBe(false);
    });

    it('should handle null and undefined', () => {
      expect(isRequired(null)).toBe(false);
      expect(isRequired(undefined)).toBe(false);
    });

    it('should validate other truthy values', () => {
      expect(isRequired(123)).toBe(true);
      expect(isRequired(true)).toBe(true);
      expect(isRequired({})).toBe(true);
    });
  });

  describe('hasMinLength', () => {
    it('should validate strings meeting minimum length', () => {
      expect(hasMinLength('hello', 3)).toBe(true);
      expect(hasMinLength('hello', 5)).toBe(true);
    });

    it('should reject strings below minimum length', () => {
      expect(hasMinLength('hi', 3)).toBe(false);
    });

    it('should handle empty or null values', () => {
      expect(hasMinLength('', 1)).toBe(false);
      expect(hasMinLength(null, 1)).toBe(false);
      expect(hasMinLength(undefined, 1)).toBe(false);
    });
  });

  describe('hasMaxLength', () => {
    it('should validate strings within maximum length', () => {
      expect(hasMaxLength('hello', 10)).toBe(true);
      expect(hasMaxLength('hello', 5)).toBe(true);
    });

    it('should reject strings exceeding maximum length', () => {
      expect(hasMaxLength('hello world', 5)).toBe(false);
    });

    it('should handle empty values as valid', () => {
      expect(hasMaxLength('', 5)).toBe(true);
      expect(hasMaxLength(null, 5)).toBe(true);
      expect(hasMaxLength(undefined, 5)).toBe(true);
    });
  });

  describe('isValidUrl', () => {
    it('should validate correct URL formats', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://example.com')).toBe(true);
      expect(isValidUrl('https://www.example.com/path?query=1')).toBe(true);
      expect(isValidUrl('ftp://example.com')).toBe(true);
    });

    it('should reject invalid URL formats', () => {
      expect(isValidUrl('invalid-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
    });

    it('should handle empty or null values', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl(undefined)).toBe(false);
    });
  });

  describe('isValidNumber', () => {
    it('should validate numeric values', () => {
      expect(isValidNumber(123)).toBe(true);
      expect(isValidNumber('123')).toBe(true);
      expect(isValidNumber('123.45')).toBe(true);
      expect(isValidNumber('-123')).toBe(true);
      expect(isValidNumber(0)).toBe(true);
    });

    it('should reject non-numeric values', () => {
      expect(isValidNumber('abc')).toBe(false);
      expect(isValidNumber('123abc')).toBe(false);
      expect(isValidNumber('')).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidNumber(null)).toBe(false);
      expect(isValidNumber(undefined)).toBe(false);
      expect(isValidNumber(NaN)).toBe(false);
    });
  });

  describe('isInRange', () => {
    it('should validate numbers within range', () => {
      expect(isInRange(5, 1, 10)).toBe(true);
      expect(isInRange('5', 1, 10)).toBe(true);
      expect(isInRange(1, 1, 10)).toBe(true);
      expect(isInRange(10, 1, 10)).toBe(true);
    });

    it('should reject numbers outside range', () => {
      expect(isInRange(0, 1, 10)).toBe(false);
      expect(isInRange(11, 1, 10)).toBe(false);
      expect(isInRange(-5, 1, 10)).toBe(false);
    });

    it('should handle non-numeric values', () => {
      expect(isInRange('abc', 1, 10)).toBe(false);
      expect(isInRange(null, 1, 10)).toBe(false);
      expect(isInRange(undefined, 1, 10)).toBe(false);
    });
  });

  describe('validateForm', () => {
    it('should validate form with all valid fields', () => {
      const rules = {
        email: [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Invalid email format' }
        ],
        name: [
          { type: 'required', message: 'Name is required' },
          { type: 'minLength', value: 2, message: 'Name too short' }
        ]
      };

      const values = {
        email: 'user@example.com',
        name: 'John Doe'
      };

      const result = validateForm(rules, values);
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
    });

    it('should return errors for invalid fields', () => {
      const rules = {
        email: [
          { type: 'required', message: 'Email is required' },
          { type: 'email', message: 'Invalid email format' }
        ],
        name: [
          { type: 'required', message: 'Name is required' }
        ]
      };

      const values = {
        email: 'invalid-email',
        name: ''
      };

      const result = validateForm(rules, values);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toContain('Invalid email format');
      expect(result.errors.name).toContain('Name is required');
    });

    it('should handle mixed valid and invalid fields', () => {
      const rules = {
        email: [{ type: 'email', message: 'Invalid email' }],
        phone: [{ type: 'phone', message: 'Invalid phone' }]
      };

      const values = {
        email: 'valid@example.com',
        phone: 'invalid-phone'
      };

      const result = validateForm(rules, values);
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeUndefined();
      expect(result.errors.phone).toContain('Invalid phone');
    });

    it('should use default error messages when not provided', () => {
      const rules = {
        name: [{ type: 'required' }]
      };

      const values = {
        name: ''
      };

      const result = validateForm(rules, values);
      expect(result.errors.name).toContain('name is required');
    });
  });
}); 