# LAWB Base MiniApp

**Base/Farcaster MiniApp version** - This is the Base MiniApp deployment, completely separate from the lawb.xyz web browser version (see [lawb2](https://github.com/wables411/lawb2) repo).

A Base Mini App (Farcaster/Base) featuring a desktop-style UI with chess game, wallet integration, and real-time multiplayer functionality.

## Features

- 🎮 **Chess Game**: Single-player vs AI and multiplayer PvP modes
- 💼 **Wallet Integration**: Wagmi/Viem with Reown AppKit and Farcaster connector
- 🔥 **Real-time Features**: Firebase-powered chat, profiles, leaderboard, and game state
- 🎨 **Desktop UI**: Linux-style navigation bar with icons, popups, and taskbar
- 📱 **Mobile Optimized**: Responsive design for Base/Farcaster Mini App deployment
- 🌓 **Theme Support**: Light and dark mode compatibility

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: React-JSS, CSS
- **Blockchain**: Wagmi, Viem, Ethers.js
- **Wallet**: Reown AppKit, Farcaster Mini App SDK
- **Backend**: Firebase (Realtime Database, Authentication)
- **Deployment**: Netlify

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

This Base MiniApp can be deployed to Netlify (separate account from lawb.xyz web version):

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18

The `netlify.toml` file contains the Base MiniApp-specific configuration. This is a clean separation from the web browser version - no shared functions or web browser-specific code.

## Project Structure

```
lawb-baseapp/
├── src/
│   ├── components/      # React components
│   ├── config/         # ABIs, tokens, chess piece sets
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   └── App.tsx         # Main application component
├── public/             # Static assets
├── netlify.toml        # Netlify configuration
└── _headers            # Netlify headers configuration
```

## License

ISC

