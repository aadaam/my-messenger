const { app, BrowserWindow, shell, session } = require('electron');
const path = require('path');

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 400,
    minHeight: 400,
    title: 'Messenger',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      // Allow Messenger to work properly
      webSecurity: true,
    },
    // macOS specific
    titleBarStyle: 'default',
    show: false, // Don't show until ready
  });

  // Set a proper user agent to avoid being blocked
  const userAgent = mainWindow.webContents.getUserAgent()
    .replace(/Electron\/[\d.]+\s/, '')
    .replace(/my-messenger\/[\d.]+\s/, '');
  mainWindow.webContents.setUserAgent(userAgent);

  // Load Messenger
  mainWindow.loadURL('https://www.messenger.com');

  // Show window when ready to avoid visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle external links - open in default browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // Allow Messenger-related URLs to open in the app
    if (url.includes('messenger.com') || url.includes('facebook.com/login')) {
      return { action: 'allow' };
    }
    // Open other URLs in default browser
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // Handle navigation to external sites
  mainWindow.webContents.on('will-navigate', (event, url) => {
    const messengerUrls = ['messenger.com', 'facebook.com'];
    const isMessengerUrl = messengerUrls.some(domain => url.includes(domain));

    if (!isMessengerUrl) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  // Clean up on close
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle certificate errors (shouldn't happen with Messenger but good to have)
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  // Don't trust invalid certificates
  callback(false);
});

// macOS: Re-create window when dock icon is clicked
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Create window when Electron is ready
app.whenReady().then(() => {
  // Set app name for macOS
  if (process.platform === 'darwin') {
    app.setName('Messenger');
  }

  createWindow();
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
