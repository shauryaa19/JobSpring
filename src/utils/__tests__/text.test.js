import { getInitials } from '../text';

describe('Text Utilities', () => {
  describe('getInitials', () => {
    it('should generate initials from full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
      expect(getInitials('Jane Smith')).toBe('JS');
      expect(getInitials('Mary Jane Watson')).toBe('MJ');
    });

    it('should handle single name', () => {
      expect(getInitials('John')).toBe('J');
      expect(getInitials('Doe')).toBe('D');
    });

    it('should handle empty or null values', () => {
      expect(getInitials('')).toBe('');
      expect(getInitials(null)).toBe('');
      expect(getInitials(undefined)).toBe('');
    });

    it('should handle multiple spaces', () => {
      expect(getInitials('John   Doe')).toBe('JD');
      expect(getInitials('  John  Doe  ')).toBe('JD');
    });

    it('should respect maxInitials parameter', () => {
      expect(getInitials('John Doe Smith', 1)).toBe('J');
      expect(getInitials('John Doe Smith', 2)).toBe('JD');
      expect(getInitials('John Doe Smith', 3)).toBe('JDS');
      expect(getInitials('John Doe Smith', 5)).toBe('JDS'); // Should not exceed available words
    });

    it('should handle mixed case', () => {
      expect(getInitials('john doe')).toBe('JD');
      expect(getInitials('JOHN DOE')).toBe('JD');
      expect(getInitials('jOhN dOe')).toBe('JD');
    });

    it('should filter out empty words', () => {
      expect(getInitials('John  Doe')).toBe('JD');
      expect(getInitials('  John   Doe  ')).toBe('JD');
      expect(getInitials('John   Doe   Smith')).toBe('JD');
    });

    it('should handle special characters in names', () => {
      expect(getInitials('Jean-Pierre Dupont')).toBe('JD');
      expect(getInitials('O\'Connor Smith')).toBe('OS');
      expect(getInitials('van der Berg')).toBe('VD'); // van der (first two words)
    });
  });
}); 