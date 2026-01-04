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

1. Enter your Twitter API Bearer token
2. Paste a tweet URL
3. View the conversation thread in a chat-like interface
4. Click any message to open it on Twitter/X

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT

## Acknowledgments

Built with Claude Code
