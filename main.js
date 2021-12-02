const { app, BrowserWindow, clipboard } = require('electron')
const path = require('path')

var lastClipboard = ""
var pollingInterval = 1000
var clipboardHistory = []

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
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

function polling(){

  var thisClipboard = clipboard.readText()
  if(thisClipboard != lastClipboard){
    console.log(thisClipboard)
    lastClipboard = thisClipboard
    clipboardHistory.push(thisClipboard)
  }
  setTimeout(polling, pollingInterval)
}
