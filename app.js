const electron = require('electron');
const { Tray, Menu } = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const iconPath = 'public/images/logo.png'
function createWindow() {

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 1000,
    icon: iconPath,
    titleBarStyle: 'hidden',
  });
  mainWindow.loadURL(`http://localhost:3000`); // on doit charger un chemin absolu

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
