const electron = require('electron')
const app = electron.app
const ipc = electron.ipcMain
const dialog = electron.dialog
const BrowserWindow = electron.BrowserWindow

let mainWindow

function createWindow () {
  let windowOptions = {
    width: 1280,
    minWidth: 1024,
    height: 1024,
    minHeight: 768,
    title: app.getName()
  }

  mainWindow = new BrowserWindow(windowOptions)
  mainWindow.loadURL(`file://${__dirname}/index.html`)
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on('open-file-dialog', function (event) {
  dialog.showOpenDialog(mainWindow, {
    title: 'Open World',
    filters: [
      {name: 'JSON', extensions: ['json']}
    ],
    properties: ['openFile']
  }, function (files) {
    if (files) event.sender.send('open-file-done', files)
  })
})

ipc.on('save-file-dialog', function (event) {
  dialog.showSaveDialog(mainWindow, {
    title: 'Save World',
    filters: [
      {name: 'JSON', extensions: ['json']}
    ]
  }, function (files) {
    if (files) event.sender.send('save-file-done', files)
  })
})
