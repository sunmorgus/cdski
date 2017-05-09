'use strict';
const electron = require('electron');
const ipc = require('electron').ipcMain;
const path = require('path')

const app = electron.app;

// adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// prevent window being garbage collected
let mainWindow;

function onClosed() {
	// dereference the window
	// for multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 480,
		height: 272,
		frame: false
	});

	const assetsDirectory = path.join(__dirname, 'assets')

	// win.loadURL(`file://${__dirname}/index.html`);
	win.loadURL(`file://${path.join(assetsDirectory, 'www/index.html')}`);
	win.on('closed', onClosed);

	return win;
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

app.on('ready', () => {
	mainWindow = createMainWindow();
});

ipc.on('quit', () => {
	process.exit();
})