/**
 * Rate Limiter Service
 * Client-side rate limiting to prevent API abuse and protect against rate limit exhaustion
 */

const RATE_LIMIT_KEY = 'twitter_api_rate_limit';
const MAX_REQUESTS_PER_HOUR = 10;
const HOUR_IN_MS = 60 * 60 * 1000;

/**
 * Get all request timestamps from storage
 * @returns {number[]} Array of timestamps
 */
const getRequestHistory = () => {
  const history = localStorage.getItem(RATE_LIMIT_KEY);
  return history ? JSON.parse(history) : [];
};

/**
 * Save request history to storage
 * @param {number[]} history - Array of timestamps
 */
const saveRequestHistory = (history) => {
  localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(history));
};

/**
 * Remove timestamps older than 1 hour
 * @param {number[]} history - Array of timestamps
 * @returns {number[]} Cleaned history
 */
const cleanOldEntries = (history) => {
  const now = Date.now();
  return history.filter(timestamp => now - timestamp < HOUR_IN_MS);
};

/**
 * Check if the user can make a request
 * @returns {{ allowed: boolean, remaining: number, resetIn: number|null }}
 */
export const checkRateLimit = () => {
  const history = cleanOldEntries(getRequestHistory());
  const remaining = MAX_REQUESTS_PER_HOUR - history.length;

  if (history.length >= MAX_REQUESTS_PER_HOUR) {
    const oldestRequest = Math.min(...history);
    const resetIn = HOUR_IN_MS - (Date.now() - oldestRequest);

    return {
      allowed: false,
      remaining: 0,
      resetIn: Math.ceil(resetIn / 1000 / 60), // Convert to minutes
    };
  }

  return {
    allowed: true,
    remaining,
    resetIn: null,
  };
};

/**
 * Record a new API request
 * Should be called after a successful API call
 */
export const recordRequest = () => {
  const history = cleanOldEntries(getRequestHistory());
  history.push(Date.now());
  saveRequestHistory(history);
};

/**
 * Get the current rate limit status
 * @returns {{ total: number, used: number, remaining: number }}
 */
export const getRateLimitStatus = () => {
  const history = cleanOldEntries(getRequestHistory());
  return {
    total: MAX_REQUESTS_PER_HOUR,
    used: history.length,
    remaining: MAX_REQUESTS_PER_HOUR - history.length,
  };
};

/**
 * Reset the rate limit (for testing or admin purposes)
 */
export const resetRateLimit = () => {
  localStorage.removeItem(RATE_LIMIT_KEY);
};

/**
 * Format time remaining until reset
 * @param {number} minutes - Minutes until reset
 * @returns {string} Formatted time string
 */
export const formatResetTime = (minutes) => {
  if (minutes < 1) {
    return 'less than a minute';
  }
  if (minutes === 1) {
    return '1 minute';
  }
  if (minutes < 60) {
    return `${minutes} minutes`;
  }
  return 'about an hour';
};
