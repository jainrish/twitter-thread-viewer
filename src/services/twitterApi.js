/**
 * Twitter API v2 Client
 * Handles authenticated requests to Twitter API
 */

import axios from 'axios';
import { getToken } from './tokenManager';

const TWITTER_API_BASE = 'https://api.twitter.com/2';

/**
 * Create axios instance with authentication
 * @returns {import('axios').AxiosInstance}
 */
const createClient = () => {
  const token = getToken();

  if (!token) {
    throw new Error('No authentication token found. Please set your Twitter API token.');
  }

  return axios.create({
    baseURL: TWITTER_API_BASE,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

/**
 * Tweet fields to request from API
 */
const TWEET_FIELDS = [
  'id',
  'text',
  'created_at',
  'author_id',
  'conversation_id',
  'referenced_tweets',
  'public_metrics',
  'entities',
].join(',');

/**
 * User fields to request from API
 */
const USER_FIELDS = [
  'id',
  'username',
  'name',
  'profile_image_url',
  'verified',
].join(',');

/**
 * Expansions to include in API requests
 */
const EXPANSIONS = [
  'author_id',
  'referenced_tweets.id',
  'referenced_tweets.id.author_id',
].join(',');

/**
 * Fetch a single tweet by ID
 * @param {string} tweetId - The tweet ID
 * @returns {Promise<Object>} Tweet data with author information
 */
export const getTweetById = async (tweetId) => {
  try {
    const client = createClient();

    const response = await client.get(`/tweets/${tweetId}`, {
      params: {
        'tweet.fields': TWEET_FIELDS,
        'user.fields': USER_FIELDS,
        'expansions': EXPANSIONS,
      },
    });

    return normalizeResponse(response.data);
  } catch (error) {
    handleApiError(error, tweetId);
  }
};

/**
 * Search for tweets in a conversation
 * @param {string} conversationId - The conversation ID
 * @param {string} [maxResults=100] - Maximum tweets to retrieve
 * @returns {Promise<Object>} Conversation tweets with author information
 */
export const getConversationThread = async (conversationId, maxResults = 100) => {
  try {
    const client = createClient();

    const response = await client.get('/tweets/search/recent', {
      params: {
        'query': `conversation_id:${conversationId}`,
        'tweet.fields': TWEET_FIELDS,
        'user.fields': USER_FIELDS,
        'expansions': EXPANSIONS,
        'max_results': Math.min(maxResults, 100), // API max is 100
      },
    });

    return normalizeResponse(response.data);
  } catch (error) {
    handleApiError(error, conversationId);
  }
};

/**
 * Fetch multiple tweets by IDs
 * @param {string[]} tweetIds - Array of tweet IDs (max 100)
 * @returns {Promise<Object>} Tweets data with author information
 */
export const getTweetsByIds = async (tweetIds) => {
  try {
    const client = createClient();

    // Twitter API allows max 100 IDs per request
    const ids = tweetIds.slice(0, 100).join(',');

    const response = await client.get('/tweets', {
      params: {
        'ids': ids,
        'tweet.fields': TWEET_FIELDS,
        'user.fields': USER_FIELDS,
        'expansions': EXPANSIONS,
      },
    });

    return normalizeResponse(response.data);
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Normalize Twitter API response to consistent format
 * Combines tweets with their author information
 * @param {Object} data - Raw API response
 * @returns {Object} Normalized response with tweets and users mapped
 */
const normalizeResponse = (data) => {
  const users = {};
  const tweets = {};

  // Map users by ID
  if (data.includes?.users) {
    data.includes.users.forEach(user => {
      users[user.id] = user;
    });
  }

  // Map included tweets (referenced tweets)
  if (data.includes?.tweets) {
    data.includes.tweets.forEach(tweet => {
      tweets[tweet.id] = {
        ...tweet,
        author: users[tweet.author_id] || null,
      };
    });
  }

  // Handle single tweet response
  if (data.data && !Array.isArray(data.data)) {
    const tweet = data.data;
    return {
      tweets: {
        [tweet.id]: {
          ...tweet,
          author: users[tweet.author_id] || null,
        },
      },
      users,
      meta: data.meta,
    };
  }

  // Handle multiple tweets response
  if (data.data && Array.isArray(data.data)) {
    data.data.forEach(tweet => {
      tweets[tweet.id] = {
        ...tweet,
        author: users[tweet.author_id] || null,
      };
    });
  }

  return {
    tweets,
    users,
    meta: data.meta,
  };
};

/**
 * Handle API errors and throw user-friendly messages
 * @param {Error} error - The error object
 * @param {string} [id] - Optional tweet/conversation ID for context
 */
const handleApiError = (error, id) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data;

    switch (status) {
      case 401:
        throw new Error('Invalid API token. Please check your Twitter API Bearer token.');

      case 403:
        throw new Error('Access denied. Your token may not have the required permissions.');

      case 404:
        throw new Error(
          id
            ? `Tweet not found (ID: ${id}). It may be deleted, private, or the ID is invalid.`
            : 'Resource not found.'
        );

      case 429:
        throw new Error(
          'Twitter API rate limit exceeded. Please try again later. ' +
          'Note: This is the Twitter API limit, not the client-side limit.'
        );

      default:
        throw new Error(
          data?.detail || data?.title || `API error (${status}): ${error.message}`
        );
    }
  }

  if (error.request) {
    throw new Error('No response from Twitter API. Please check your internet connection.');
  }

  throw new Error(`Request failed: ${error.message}`);
};

/**
 * Test the API token validity
 * @returns {Promise<boolean>} True if token is valid
 */
export const testToken = async () => {
  try {
    const client = createClient();
    // Make a minimal request to test auth
    await client.get('/tweets/search/recent', {
      params: {
        query: 'test',
        max_results: 10,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};
