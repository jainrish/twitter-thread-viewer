import { useState } from 'react';
import { saveToken, clearToken, hasToken, isValidTokenFormat } from '../services/tokenManager';
import { testToken } from '../services/twitterApi';

/**
 * TokenInput Component
 * Allows users to enter and save their Twitter API Bearer token
 */
export default function TokenInput({ onTokenSaved }) {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showToken, setShowToken] = useState(false);
  const isTokenSaved = hasToken();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isValidTokenFormat(token)) {
      setError('Please enter a valid token');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save token temporarily to test it
      saveToken(token);

      // Test the token
      const isValid = await testToken();

      if (!isValid) {
        clearToken();
        setError('Invalid token. Please check your Twitter API Bearer token.');
        return;
      }

      // Token is valid, keep it saved
      setToken('');
      onTokenSaved?.();
    } catch (err) {
      clearToken();
      setError(err.message || 'Failed to validate token');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    setToken('');
    setError('');
    window.location.reload();
  };

  if (isTokenSaved) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-green-800 font-medium">API Token Configured</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-green-700 hover:text-green-900 underline"
        >
          Clear Token
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Enter Your Twitter API Token
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        To use this app, you need a Twitter API Bearer token.{' '}
        <a
          href="https://developer.twitter.com/en/portal/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Get one here
        </a>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
            Bearer Token
          </label>
          <div className="relative">
            <input
              type={showToken ? 'text' : 'password'}
              id="token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Enter your Twitter API Bearer token"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showToken ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !token}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {isSubmitting ? 'Validating...' : 'Save Token'}
        </button>
      </form>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> Your token is stored locally in your browser and never sent to any server except Twitter's API.
        </p>
      </div>
    </div>
  );
}
