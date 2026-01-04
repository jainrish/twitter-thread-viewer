/**
 * Date Formatter Utility
 * Format tweet timestamps for display in the chat interface
 */

import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';

/**
 * Format a date for chat-style display
 * - If today: "10:30 AM"
 * - If yesterday: "Yesterday 10:30 AM"
 * - If this week: "Monday 10:30 AM"
 * - If older: "Jan 15, 2024 10:30 AM"
 *
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted date string
 */
export const formatChatTimestamp = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isToday(dateObj)) {
    return format(dateObj, 'h:mm a');
  }

  if (isYesterday(dateObj)) {
    return `Yesterday ${format(dateObj, 'h:mm a')}`;
  }

  const daysAgo = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24));

  if (daysAgo < 7) {
    return format(dateObj, 'EEEE h:mm a');
  }

  if (daysAgo < 365) {
    return format(dateObj, 'MMM d, h:mm a');
  }

  return format(dateObj, 'MMM d, yyyy h:mm a');
};

/**
 * Format a date as relative time
 * Examples: "2 hours ago", "5 minutes ago", "just now"
 *
 * @param {string|Date} date - The date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

/**
 * Format a full date for display
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted as "January 15, 2024 at 10:30 AM"
 */
export const formatFullDate = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, "MMMM d, yyyy 'at' h:mm a");
};

/**
 * Format metric numbers for display
 * Examples: 1234 -> "1.2K", 1500000 -> "1.5M"
 *
 * @param {number} num - The number to format
 * @returns {string} Formatted number string
 */
export const formatMetricNumber = (num) => {
  if (num < 1000) {
    return num.toString();
  }

  if (num < 1000000) {
    return `${(num / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  }

  return `${(num / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
};
