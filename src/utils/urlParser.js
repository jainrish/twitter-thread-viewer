/**
 * URL Parser Utility
 * Extracts tweet ID from various Twitter/X URL formats
 */

/**
 * Extract tweet ID from a Twitter/X URL
 * Supports formats:
 * - https://twitter.com/username/status/1234567890
 * - https://x.com/username/status/1234567890
 * - https://mobile.twitter.com/username/status/1234567890
 * - twitter.com/username/status/1234567890 (without protocol)
 *
 * @param {string} url - The tweet URL
 * @returns {string|null} The tweet ID or null if invalid
 */
export const extractTweetId = (url) => {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    // Remove whitespace
    const trimmed = url.trim();

    // Add protocol if missing
    const urlWithProtocol = trimmed.startsWith('http')
      ? trimmed
      : `https://${trimmed}`;

    // Parse URL
    const urlObj = new URL(urlWithProtocol);

    // Check if it's a Twitter/X domain
    const validDomains = ['twitter.com', 'x.com', 'mobile.twitter.com'];
    const hostname = urlObj.hostname.replace('www.', '');

    if (!validDomains.includes(hostname)) {
      return null;
    }

    // Extract tweet ID from path: /username/status/1234567890
    const pathMatch = urlObj.pathname.match(/\/status\/(\d+)/);

    if (pathMatch && pathMatch[1]) {
      return pathMatch[1];
    }

    return null;
  } catch (error) {
    // Invalid URL
    return null;
  }
};

/**
 * Validate if a string is a valid tweet ID
 * @param {string} tweetId - The tweet ID to validate
 * @returns {boolean} True if valid tweet ID format
 */
export const isValidTweetId = (tweetId) => {
  if (!tweetId || typeof tweetId !== 'string') {
    return false;
  }

  // Tweet IDs are numeric strings, typically 18-19 digits
  return /^\d{10,20}$/.test(tweetId);
};

/**
 * Build a Twitter URL from a tweet ID
 * @param {string} tweetId - The tweet ID
 * @param {string} username - Optional username (defaults to 'i')
 * @returns {string} The constructed Twitter URL
 */
export const buildTweetUrl = (tweetId, username = 'i') => {
  return `https://x.com/${username}/status/${tweetId}`;
};
