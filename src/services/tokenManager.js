/**
 * Token Manager Service
 * Handles storing and retrieving Twitter API Bearer token in localStorage
 */

const TOKEN_KEY = 'twitter_api_token';

/**
 * Save the Twitter API token to localStorage
 * @param {string} token - The Bearer token
 */
export const saveToken = (token) => {
  if (!token || typeof token !== 'string') {
    throw new Error('Invalid token: must be a non-empty string');
  }
  localStorage.setItem(TOKEN_KEY, token.trim());
};

/**
 * Get the stored Twitter API token
 * @returns {string|null} The stored token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Check if a token exists in storage
 * @returns {boolean} True if token exists, false otherwise
 */
export const hasToken = () => {
  return getToken() !== null;
};

/**
 * Remove the stored token (logout)
 */
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Validate token format (basic check)
 * @param {string} token - The token to validate
 * @returns {boolean} True if token appears valid
 */
export const isValidTokenFormat = (token) => {
  if (!token || typeof token !== 'string') {
    return false;
  }

  // Basic validation: should be a non-empty string with no whitespace
  const trimmed = token.trim();
  return trimmed.length > 0 && !/\s/.test(trimmed);
};
