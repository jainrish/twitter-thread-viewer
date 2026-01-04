/**
 * Thread Parser Service
 * Resolves and parses Twitter conversation threads
 */

import { getTweetById, getConversationThread, getTweetsByIds } from './twitterApi';

/**
 * Parse a complete conversation thread from a tweet URL/ID
 * @param {string} tweetId - The tweet ID to start from
 * @returns {Promise<Object>} Parsed thread with all tweets and metadata
 */
export const parseThread = async (tweetId) => {
  try {
    // 1. Fetch the initial tweet
    const initialResponse = await getTweetById(tweetId);
    const initialTweet = initialResponse.tweets[tweetId];

    if (!initialTweet) {
      throw new Error('Tweet not found');
    }

    // 2. Get the conversation ID
    const conversationId = initialTweet.conversation_id || tweetId;

    // 3. Fetch the entire conversation
    const conversationResponse = await getConversationThread(conversationId);

    // 4. Combine all tweets
    const allTweets = {
      ...conversationResponse.tweets,
      ...initialResponse.tweets,
    };

    // 5. Fetch any referenced tweets (quotes) that weren't in the conversation
    const quotedTweetIds = extractQuotedTweetIds(allTweets);
    let quotedTweets = {};

    if (quotedTweetIds.length > 0) {
      const quotedResponse = await getTweetsByIds(quotedTweetIds);
      quotedTweets = quotedResponse.tweets;
    }

    // 6. Merge all tweets
    const mergedTweets = {
      ...allTweets,
      ...quotedTweets,
    };

    // 7. Build conversation tree
    const thread = buildConversationTree(mergedTweets, conversationId);

    return {
      tweets: thread,
      conversationId,
      rootTweetId: conversationId,
      focusTweetId: tweetId,
      tweetCount: thread.length,
    };
  } catch (error) {
    throw new Error(`Failed to parse thread: ${error.message}`);
  }
};

/**
 * Extract quoted tweet IDs from a collection of tweets
 * @param {Object} tweets - Object mapping tweet IDs to tweet data
 * @returns {string[]} Array of quoted tweet IDs
 */
const extractQuotedTweetIds = (tweets) => {
  const quotedIds = new Set();

  Object.values(tweets).forEach(tweet => {
    if (tweet.referenced_tweets) {
      tweet.referenced_tweets.forEach(ref => {
        if (ref.type === 'quoted' && !tweets[ref.id]) {
          quotedIds.add(ref.id);
        }
      });
    }
  });

  return Array.from(quotedIds);
};

/**
 * Build a chronological conversation tree from tweets
 * @param {Object} tweets - Object mapping tweet IDs to tweet data
 * @param {string} conversationId - The conversation ID
 * @returns {Array} Sorted array of tweets with relationship metadata
 */
const buildConversationTree = (tweets, conversationId) => {
  const tweetArray = Object.values(tweets);

  // Filter tweets that belong to this conversation
  const conversationTweets = tweetArray.filter(
    tweet => tweet.conversation_id === conversationId
  );

  // Enrich tweets with relationship info
  const enrichedTweets = conversationTweets.map(tweet => ({
    ...tweet,
    isReply: hasReplyReference(tweet),
    isQuote: hasQuoteReference(tweet),
    isRetweet: hasRetweetReference(tweet),
    replyToId: getReplyToId(tweet),
    quotedTweetId: getQuotedTweetId(tweet),
    quotedTweet: getQuotedTweet(tweet, tweets),
  }));

  // Sort by created_at (chronological order)
  const sorted = enrichedTweets.sort((a, b) => {
    return new Date(a.created_at) - new Date(b.created_at);
  });

  return sorted;
};

/**
 * Check if tweet has a reply reference
 * @param {Object} tweet - Tweet object
 * @returns {boolean}
 */
const hasReplyReference = (tweet) => {
  if (!tweet.referenced_tweets) return false;
  return tweet.referenced_tweets.some(ref => ref.type === 'replied_to');
};

/**
 * Check if tweet has a quote reference
 * @param {Object} tweet - Tweet object
 * @returns {boolean}
 */
const hasQuoteReference = (tweet) => {
  if (!tweet.referenced_tweets) return false;
  return tweet.referenced_tweets.some(ref => ref.type === 'quoted');
};

/**
 * Check if tweet has a retweet reference
 * @param {Object} tweet - Tweet object
 * @returns {boolean}
 */
const hasRetweetReference = (tweet) => {
  if (!tweet.referenced_tweets) return false;
  return tweet.referenced_tweets.some(ref => ref.type === 'retweeted');
};

/**
 * Get the ID of the tweet being replied to
 * @param {Object} tweet - Tweet object
 * @returns {string|null}
 */
const getReplyToId = (tweet) => {
  if (!tweet.referenced_tweets) return null;
  const reply = tweet.referenced_tweets.find(ref => ref.type === 'replied_to');
  return reply ? reply.id : null;
};

/**
 * Get the ID of the quoted tweet
 * @param {Object} tweet - Tweet object
 * @returns {string|null}
 */
const getQuotedTweetId = (tweet) => {
  if (!tweet.referenced_tweets) return null;
  const quote = tweet.referenced_tweets.find(ref => ref.type === 'quoted');
  return quote ? quote.id : null;
};

/**
 * Get the full quoted tweet object
 * @param {Object} tweet - Tweet object
 * @param {Object} allTweets - All available tweets
 * @returns {Object|null}
 */
const getQuotedTweet = (tweet, allTweets) => {
  const quotedId = getQuotedTweetId(tweet);
  return quotedId && allTweets[quotedId] ? allTweets[quotedId] : null;
};

/**
 * Find the root tweet of a conversation
 * @param {Array} tweets - Array of tweets in conversation
 * @returns {Object|null} The root tweet
 */
export const findRootTweet = (tweets) => {
  return tweets.find(tweet => !tweet.isReply) || tweets[0] || null;
};

/**
 * Build a reply chain for a specific tweet
 * @param {string} tweetId - The tweet ID
 * @param {Array} allTweets - All tweets in the conversation
 * @returns {Array} Array of tweets in the reply chain
 */
export const buildReplyChain = (tweetId, allTweets) => {
  const chain = [];
  let currentId = tweetId;

  while (currentId) {
    const tweet = allTweets.find(t => t.id === currentId);
    if (!tweet) break;

    chain.unshift(tweet);
    currentId = tweet.replyToId;
  }

  return chain;
};
