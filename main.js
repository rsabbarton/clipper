const { app, BrowserWindow, clipboard, ipcMain, Menu, MenuItem, shell } = require('electron')
const path = require('path')
const fs = require('fs')

var lastClipboard = ""
var pollingInterval = 1000
var clipboardHistory = []
var win
var historyLoaded = false
var clippetFilter = []

var homeDirectory = app.getPath('home')
var dataPath = path.join(homeDirectory, ".clipper")
var historyFile = path.join(dataPath, "history.json")
var customWebToolsFile = path.join(dataPath, "custom-web-tools.json")
var clippetsFolder = path.join(dataPath, 'clippets')
var clippetsIndexFile = path.join(clippetsFolder, "index.json")

const maxHistoryLength = 100


console.log(historyFile)

if(!fs.existsSync(dataPath)){
  fs.mkdirSync(dataPath)
}
if(!fs.existsSync(clippetsFolder)){
  fs.mkdirSync(clippetsFolder)
}

if(fs.existsSync(historyFile)){
  console.log("loading history file from: " + historyFile)
  clipboardHistory = JSON.parse(fs.readFileSync(historyFile))
  historyLoaded = true
  lastClipboard = clipboardHistory[clipboardHistory.length - 1]
}

var customWebTools = []
if(fs.existsSync(customWebToolsFile)){
  customWebTools = JSON.parse(fs.readFileSync(customWebToolsFile))
}

const createWindow = () => {
  win = new BrowserWindow({
    width: 800,
    height: 800,
    x: 30,
    y: 30,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadFile('index.html')
  win.webContents.once('dom-ready', ()=>{
    // Uncomment to auto launch the console
    // win.webContents.openDevTools()
  })
}

app.whenReady().then(() => {
  createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  
  
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on("getAllClips", function(event, data){

})

ipcMain.on("showmenu", function(event, data){
  var menu = new Menu()
  console.log("popping menu with: " + data)
  
  if(data.startsWith("http")){
    menu.append(new MenuItem ({
      label: 'Open With Browser',
      click() { 
        shell.openExternal(data)
      }
    }))
  }
  
  menu.append(new MenuItem ({
    label: 'Search with Google',
    click() { 
      shell.openExternal("https://www.google.com/search?q=" + data)
    }
  }))
 
  menu.append(new MenuItem({type: 'separator'}))
  
  customWebTools.forEach((tool)=>{
    var cap = tool[0]
    var url = tool[1]
    if(cap.length > 0){
      url = url.replace("%s", data)
      menu.append(new MenuItem ({
        label: cap,
        click() { 
          shell.openExternal(url)
        }
      }))
    }
  })

  menu.append(new MenuItem({type: 'separator'}))
  menu.append(new MenuItem ({
    label: 'Delete',
    click() { 
      console.log('Delete Clicked:' + data)
      deleteClips(data)
      win.webContents.send("deleteClips", data)
    }
  }))
 
 menu.popup(BrowserWindow.fromWebContents(event.sender))
})

ipcMain.on("loaded", function(event, data){
  console.log("renderer loaded!")
  if(historyLoaded){
    win.webContents.send('clipRefresh', clipboardHistory)
  }
  setTimeout(polling, pollingInterval)
  win.webContents.send('apploaded', true)
})

ipcMain.on("saveclippet", function(event, data){
  console.log("saving clippet", data)

  var filename = "clip_" + Date.now() + '.json'

  fs.writeFileSync(path.join(clippetsFolder, filename), JSON.stringify(data))

  
  var index = []
  if(fs.existsSync(clippetsIndexFile)){
    JSON.parse(fs.readFileSync(clippetsIndexFile))
  }
  var newEntry = {}
  newEntry.filename = filename
  newEntry.name = data.name
  newEntry.tags = data.tags
  index.push(newEntry)

  fs.writeFileSync(clippetsIndexFile, JSON.stringify(index))
})

ipcMain.on('updateclippetfilter', function(event, filter){

})

function polling(){

  var thisClipboard = clipboard.readText()
  if(thisClipboard != lastClipboard){
    console.log(thisClipboard)
    lastClipboard = thisClipboard
    clipboardHistory.push(thisClipboard)
    if(clipboardHistory.length > maxHistoryLength){
      clipboardHistory = clipboardHistory.slice( -maxHistoryLength)
    }
    saveHistory()
    
    if(thisClipboard.length > 0){
      win.webContents.send("newClip", thisClipboard)
    }
  }
  setTimeout(polling, pollingInterval)
}


function saveHistory(){
  fs.writeFileSync(historyFile, JSON.stringify(clipboardHistory))
}


function deleteClips(data){
  //TODO - Add Delete Code
  clipboardHistory = clipboardHistory.filter((element, index, array)=>{
    if(element === data){
      return false
    } else {
      return true
    }
  })
  saveHistory()
  win.webContents.send("clipRefresh", clipboardHistory)
}