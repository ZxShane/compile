const electron = require('electron')
const app = electron.app
const Menu = electron.Menu
const BrowserWindow = electron.BrowserWindow

const path = require('path')

const setMenu = require('./main-process/application-menu')

// require('electron-reload')(__dirname);

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({ width: 1280, height: 720 })
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  setMenu(mainWindow)
  // mainWindow.webContents.openDevTools()
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})