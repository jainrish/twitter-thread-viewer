import TweetMetrics from './TweetMetrics';
import { formatChatTimestamp } from '../utils/dateFormatter';
import { buildTweetUrl } from '../utils/urlParser';

/**
 * TweetMessage Component
 * Individual tweet displayed as a chat message bubble
 */
export default function TweetMessage({ tweet, isOwnMessage = false }) {
  const author = tweet.author;
  const tweetUrl = buildTweetUrl(tweet.id, author?.username);

  const handleClick = () => {
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`flex gap-3 mb-4 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {author?.profile_image_url ? (
          <img
            src={author.profile_image_url}
            alt={author.name}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600 text-sm font-medium">
              {author?.name?.[0] || '?'}
            </span>
          </div>
        )}
      </div>

      {/* Message Bubble */}
      <div className={`flex-1 max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
        {/* Author Info */}
        <div className={`flex items-center gap-2 mb-1 ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="font-semibold text-sm text-gray-900">
            {author?.name || 'Unknown'}
          </span>
          {author?.verified && (
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
            </svg>
          )}
          <span className="text-xs text-gray-500">
            @{author?.username || 'unknown'}
          </span>
        </div>

        {/* Tweet Content */}
        <div
          onClick={handleClick}
          className={`rounded-2xl px-4 py-3 cursor-pointer transition-all hover:shadow-md ${
            isOwnMessage
              ? 'bg-blue-500 text-white'
              : 'bg-white border border-gray-200 text-gray-900'
          }`}
        >
          {/* Tweet Text */}
          <p className="text-sm whitespace-pre-wrap break-words">
            {tweet.text}
          </p>

          {/* Quoted Tweet */}
          {tweet.quotedTweet && (
            <div className={`mt-3 p-3 rounded-lg border ${
              isOwnMessage
                ? 'bg-blue-400 border-blue-300'
                : 'bg-gray-50 border-gray-200'
            }`}>
              <div className="flex items-center gap-1 mb-1">
                <span className={`text-xs font-medium ${
                  isOwnMessage ? 'text-blue-100' : 'text-gray-700'
                }`}>
                  {tweet.quotedTweet.author?.name || 'Unknown'}
                </span>
                <span className={`text-xs ${
                  isOwnMessage ? 'text-blue-200' : 'text-gray-500'
                }`}>
                  @{tweet.quotedTweet.author?.username || 'unknown'}
                </span>
              </div>
              <p className={`text-xs ${
                isOwnMessage ? 'text-blue-50' : 'text-gray-600'
              }`}>
                {tweet.quotedTweet.text}
              </p>
            </div>
          )}

          {/* Metrics */}
          {tweet.public_metrics && (
            <div className={isOwnMessage ? 'opacity-90' : ''}>
              <TweetMetrics publicMetrics={tweet.public_metrics} />
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className={`mt-1 text-xs text-gray-500 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
          {formatChatTimestamp(tweet.created_at)}
        </div>

        {/* Reply/Quote indicator */}
        {(tweet.isReply || tweet.isQuote) && (
          <div className={`mt-1 flex items-center gap-1 text-xs ${
            isOwnMessage ? 'flex-row-reverse text-right' : 'text-left'
          } text-gray-400`}>
            {tweet.isReply && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                </svg>
                Reply
              </span>
            )}
            {tweet.isQuote && !tweet.isReply && (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Quote
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
