const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const ClientId = '413133032594079755';
process.on('unhandledRejection', (err) => { console.error(err); });
app.setAsDefaultProtocolClient(`discord-${ClientId}`);
let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({ width: 390, height: 100, resizable: false, titleBarStyle: 'hidden', });
    mainWindow.loadURL(url.format({ pathname: path.join(__dirname, 'index.html'), protocol: 'file:', slashes: true, }));
    mainWindow.on('closed', () => { mainWindow = null; });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => { app.quit(); });
app.on('activate', () => { if (mainWindow === null) { createWindow(); } });

