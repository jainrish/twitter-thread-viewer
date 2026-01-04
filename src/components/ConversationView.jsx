import { useEffect, useRef } from 'react';
import TweetMessage from './TweetMessage';

/**
 * ConversationView Component
 * Displays the conversation thread in a chat-like interface
 */
export default function ConversationView({ thread, focusTweetId }) {
  const messagesEndRef = useRef(null);
  const focusRef = useRef(null);

  // Scroll to bottom on initial load
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread]);

  // Scroll to focus tweet if specified
  useEffect(() => {
    if (focusTweetId && focusRef.current) {
      setTimeout(() => {
        focusRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [focusTweetId]);

  if (!thread || !thread.tweets || thread.tweets.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-600">No tweets to display</p>
      </div>
    );
  }

  // Determine if a tweet should be displayed on the right (as "own message")
  // For variety, we'll alternate based on author
  const authors = [...new Set(thread.tweets.map(t => t.author_id))];
  const authorAlignment = {};
  authors.forEach((authorId, index) => {
    authorAlignment[authorId] = index % 2 === 1;
  });

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Conversation
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {thread.tweetCount} {thread.tweetCount === 1 ? 'tweet' : 'tweets'}
        </p>
      </div>

      {/* Messages Container */}
      <div className="px-6 py-4 max-h-[600px] overflow-y-auto">
        {thread.tweets.map((tweet) => {
          const isFocusTweet = tweet.id === focusTweetId;
          const isOwnMessage = authorAlignment[tweet.author_id] || false;

          return (
            <div
              key={tweet.id}
              ref={isFocusTweet ? focusRef : null}
              className={isFocusTweet ? 'ring-2 ring-blue-400 rounded-3xl -mx-2 px-2' : ''}
            >
              <TweetMessage tweet={tweet} isOwnMessage={isOwnMessage} />
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 rounded-b-lg">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Conversation ID: {thread.conversationId}</span>
          <a
            href={`https://x.com/i/status/${thread.rootTweetId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            View on X →
          </a>
        </div>
      </div>
    </div>
  );
}
