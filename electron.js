const electron = require('electron')
const log = require('electron-log')
const path = require('path')
const { autoUpdater } = require('electron-updater')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

const isDev = 'ELECTRON_IS_DEV' in process.env ? parseInt(process.env.ELECTRON_IS_DEV, 10) === 1 : !app.isPackaged
let mainWindow

function createWindow() {
    log.transports.file.level = 'debug'
    autoUpdater.logger = log
    autoUpdater.checkForUpdatesAndNotify()
    mainWindow = new BrowserWindow({ width: 1200, height: 800 })
    mainWindow.maximize()
    mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`)
    mainWindow.on('closed', () => (mainWindow = null))
}

function sendStatusToWindow(text) {
    log.info(text)
    mainWindow.webContents.send('message', text)
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

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...')
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.')
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.')
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err)
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = 'Download speed: ' + progressObj.bytesPerSecond
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    log_message = log_message + ' (' + progressObj.transferred + '/' + progressObj.total + ')'
    sendStatusToWindow(log_message)
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded')
})
