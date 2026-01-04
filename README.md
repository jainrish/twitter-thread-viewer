# Twitter Thread Viewer

A client-side web application that visualizes Twitter/X conversation threads in an iMessage/WhatsApp style chat interface.

## Features

- 💬 Chat-like interface for viewing Twitter threads
- 🔗 Support for replies and quote tweets
- 📊 Display engagement metrics (views, likes, replies)
- 🔒 Fully client-side - no backend required
- 🔑 User-provided API token authentication

## Tech Stack

- **Framework**: React with Vite
- **Styling**: Tailwind CSS
- **API**: Twitter API v2
- **State Management**: React hooks
- **Storage**: LocalStorage for token persistence

## Project Structure

```
src/
├── components/          # React components
├── services/           # API and business logic
├── utils/              # Helper functions
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Twitter Developer account with API access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jainrish/twitter-thread-viewer.git
cd twitter-thread-viewer
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Getting Your Twitter API Token

1. Go to [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard)
2. Create a new app or use an existing one
3. Generate a Bearer Token
4. Enter the token in the app when prompted

## Development Phases

This project was built in phases:

- ✅ **Phase 1**: Project setup with Tailwind CSS
- ✅ **Phase 2**: Token management and rate limiting services
- ✅ **Phase 3**: Twitter API integration and thread parser
- ✅ **Phase 4**: Basic UI components
- ✅ **Phase 5**: Chat interface components
- ✅ **Phase 6**: Error handling and improvements
- ✅ **Phase 7**: Polish and final documentation

## Usage

### Step-by-Step Guide

1. **First Time Setup**
   - Visit the app in your browser
   - You'll be prompted to enter your Twitter API Bearer token
   - Paste your token and click "Save Token"
   - The app will validate your token

2. **Viewing Threads**
   - Paste any Twitter/X tweet URL in the input field
   - Click "View Thread" or press Enter
   - The conversation will load in chat format
   - Click any message bubble to open it on Twitter/X

3. **Managing Conversations**
   - Click "Clear" to remove the current conversation
   - Click "Clear Token" to log out and remove your API token

### Supported URL Formats

```
https://twitter.com/username/status/1234567890
https://x.com/username/status/1234567890
twitter.com/username/status/1234567890
```

## Features in Detail

### Chat-Style Interface
- **Message Bubbles**: Tweets displayed as chat messages with rounded corners
- **Avatars**: User profile pictures with verification badges
- **Alternating Sides**: Messages alternate left/right by author for easy following
- **Timestamps**: Smart formatting (e.g., "10:30 AM", "Yesterday 2:15 PM")
- **Quoted Tweets**: Nested display within message bubbles

### Engagement Metrics
- Views (👁)
- Likes (❤️)
- Replies (💬)
- Retweets (🔁)
- Formatted numbers (e.g., 1.2K, 1.5M)

### Rate Limiting
- Client-side rate limiting (10 requests per hour)
- Visual remaining requests counter
- Reset time display when limit reached
- Prevents API quota exhaustion

### Bot Protection
- Honeypot field detection
- Client-side validation
- URL format verification

## Troubleshooting

### "Invalid token" Error
- Ensure you copied the full Bearer token
- Check that your app has `tweet.read` and `users.read` scopes
- Verify the token hasn't expired

### "Tweet not found" Error
- The tweet may be deleted or private
- Verify the URL is correct
- Check if the account is public

### "Rate limit exceeded" Error
- **Client-side limit**: Wait for the displayed reset time
- **Twitter API limit**: Wait 15 minutes and try again

### Thread Not Loading
- Check your internet connection
- Verify the tweet URL is valid
- Try clearing your browser cache

## Limitations

- **Rate Limits**: 10 requests per hour (client-side), plus Twitter API limits
- **Tweet Access**: Only public tweets are accessible
- **Thread Depth**: Limited by Twitter API constraints
- **Authentication**: Requires user's own Twitter API token

## Deployment

### Build for Production

```bash
npm run build
```

The `dist/` folder will contain your production build.

### Deploy to Static Hosting

This app can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist/` folder
- **GitHub Pages**: Push `dist/` to a `gh-pages` branch
- **Cloudflare Pages**: Connect your repository

## Security Notes

- Your API token is stored **only** in your browser's localStorage
- No data is sent to any server except Twitter's API
- The app runs entirely client-side
- Clear your token before using public computers

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

### Development

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details

## Acknowledgments

- Built with [Claude Code](https://claude.com/claude-code)
- Powered by [Twitter API v2](https://developer.twitter.com/en/docs/twitter-api)
- UI inspired by iMessage and WhatsApp

## Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/jainrish/twitter-thread-viewer/issues)
- Check existing issues for solutions
