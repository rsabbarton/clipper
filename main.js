const { app, BrowserWindow, clipboard, ipcMain } = require('electron')
const path = require('path')

var lastClipboard = ""
var pollingInterval = 1000
var clipboardHistory = []
var win

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
  setTimeout(polling, pollingInterval)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("getAllClips", function(event, data){

})

function polling(){

  var thisClipboard = clipboard.readText()
  if(thisClipboard != lastClipboard){
    console.log(thisClipboard)
    lastClipboard = thisClipboard
    clipboardHistory.push(thisClipboard)
    win.webContents.send("newClip", thisClipboard)
  }
  setTimeout(polling, pollingInterval)
}
