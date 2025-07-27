/**
 * Generate initials from a name
 * @param {string} name - The full name
 * @param {number} maxInitials - Maximum number of initials (default: 2)
 * @returns {string} Initials
 */
export const getInitials = (name, maxInitials = 2) => {
  if (!name) return '';
  
  return name
    .trim()
    .split(/\s+/) // Split by one or more whitespace characters
    .filter(word => word.length > 0) // Filter out empty strings
    .slice(0, maxInitials)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};
