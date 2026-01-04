import { useState } from 'react';
import TokenInput from './components/TokenInput';
import TweetInput from './components/TweetInput';
import LoadingSpinner from './components/LoadingSpinner';
import ConversationView from './components/ConversationView';
import { hasToken } from './services/tokenManager';
import { parseThread } from './services/threadParser';
import { recordRequest } from './services/rateLimiter';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [thread, setThread] = useState(null);
  const [error, setError] = useState('');
  const [tokenConfigured, setTokenConfigured] = useState(hasToken());

  const handleTokenSaved = () => {
    setTokenConfigured(true);
  };

  const handleTweetSubmit = async (tweetId) => {
    setIsLoading(true);
    setError('');
    setThread(null);

    try {
      const parsedThread = await parseThread(tweetId);
      setThread(parsedThread);
      recordRequest(); // Track the API call for rate limiting
    } catch (err) {
      setError(err.message || 'Failed to load thread');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Twitter Thread Viewer
          </h1>
          <p className="text-gray-600 mt-1">
            View Twitter/X conversations in a chat-like interface
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Token Input */}
          {!tokenConfigured ? (
            <TokenInput onTokenSaved={handleTokenSaved} />
          ) : (
            <>
              {/* Tweet Input */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <TweetInput onSubmit={handleTweetSubmit} isLoading={isLoading} />
              </div>

              {/* Loading State */}
              {isLoading && <LoadingSpinner message="Fetching conversation thread..." />}

              {/* Error State */}
              {error && !isLoading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-red-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="text-red-800 font-medium">Error</h3>
                      <p className="text-red-700 text-sm mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Thread Display */}
              {thread && !isLoading && (
                <ConversationView thread={thread} focusTweetId={thread.focusTweetId} />
              )}

              {/* Empty State */}
              {!thread && !isLoading && !error && (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No conversation loaded
                  </h3>
                  <p className="text-gray-600">
                    Paste a tweet URL above to view the conversation thread
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 mt-12 border-t border-gray-200">
        <p className="text-center text-sm text-gray-500">
          Built with React + Vite + Tailwind CSS
        </p>
      </footer>
    </div>
  );
}

export default App;
