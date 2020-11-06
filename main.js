const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(`file://${__dirname}/index.html#v${app.getVersion()}`);
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
  mainWindow.once('ready-to-show', () => {
    autoUpdater.logger = require("electron-log")
    autoUpdater.logger.transports.file.level = "info"
    console.log('before trigger check updates ad notifications')
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('app_version', (event) => {
  event.sender.send('app_version', { version: app.getVersion() });
});

autoUpdater.on('update-available', () => {
  console.log("autoUpdater update method run");
  mainWindow.webContents.send('update_available');
});

autoUpdater.on('update-downloaded', () => {
  console.log("autoUpdater update_downloaded method run");
  mainWindow.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
  console.log("autoUpdater restart_app method run");
  autoUpdater.quitAndInstall();
});
