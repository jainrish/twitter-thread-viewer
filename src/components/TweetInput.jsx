import { useState } from 'react';
import { extractTweetId, isValidTweetId } from '../utils/urlParser';
import { checkRateLimit, formatResetTime } from '../services/rateLimiter';

/**
 * TweetInput Component
 * Input field for tweet URLs with rate limiting and bot protection
 */
export default function TweetInput({ onSubmit, isLoading }) {
  const [url, setUrl] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Bot trap
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Honeypot check - if filled, likely a bot
    if (honeypot) {
      setError('Invalid submission detected');
      return;
    }

    // Check rate limit
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      setError(
        `Rate limit exceeded. Please try again in ${formatResetTime(rateLimit.resetIn)}.`
      );
      return;
    }

    // Extract tweet ID
    const tweetId = extractTweetId(url);

    if (!tweetId) {
      setError('Please enter a valid Twitter/X URL');
      return;
    }

    if (!isValidTweetId(tweetId)) {
      setError('Invalid tweet ID format');
      return;
    }

    // Call parent handler
    onSubmit(tweetId);
    setUrl('');
  };

  const getRateLimitInfo = () => {
    const rateLimit = checkRateLimit();
    return `${rateLimit.remaining} requests remaining`;
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="tweet-url" className="block text-sm font-medium text-gray-700 mb-1">
            Tweet URL
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="tweet-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://x.com/username/status/1234567890"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !url}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-6 rounded-lg transition-colors whitespace-nowrap"
            >
              {isLoading ? 'Loading...' : 'View Thread'}
            </button>
          </div>

          {/* Honeypot field - hidden from users */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="absolute opacity-0 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Supports twitter.com and x.com URLs</span>
          <span>{getRateLimitInfo()}</span>
        </div>
      </form>
    </div>
  );
}
