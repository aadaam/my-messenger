# My Messenger

A standalone desktop app for Facebook Messenger, built with Electron.

## Why?

Facebook is deprecating the official Messenger app for Mac. After the deprecation period, users will be redirected to use Facebook.com for messaging instead of having a dedicated app.

This project provides a simple Electron wrapper around messenger.com, giving you:

- A standalone desktop app (not buried in browser tabs)
- Native macOS integration (dock icon, app switcher)
- Latest Chromium engine for security and compatibility
- No telemetry or extra features — just Messenger

## Installation

### Download

Check the [Releases](https://github.com/aadaam/my-messenger/releases) page for pre-built DMG files.

### Build from source

```bash
# Clone the repo
git clone https://github.com/aadaam/my-messenger.git
cd my-messenger

# Install dependencies
npm install

# Run in development mode
npm start

# Build macOS app
npm run build:mac
```

The built DMG will be in the `dist/` folder.

## First launch

Since the app is not signed with an Apple Developer certificate, macOS will block it by default. To open it:

1. Right-click the app → Open
2. Click "Open" in the security dialog

Or run this after copying to Applications:
```bash
xattr -cr /Applications/Messenger.app
```

## License

MIT
