const path = require('path')
const fs = require('fs')
const os = require("os")


var homeDirectory = os.homedir()
var dataPath = path.join(homeDirectory, ".clipper")
var historyFile = path.join(dataPath, "history.json")
var customWebToolsFile = path.join(dataPath, "custom-web-tools.json")
var clippetsFolder = path.join(dataPath, 'clippets')
var clippetsIndexFile = path.join(clippetsFolder, "index.json")
var modPath = path.join(dataPath,"mods")
var tempPath = path.join(dataPath,"temp")
let logfilePath = path.join(homeDirectory, ".clipper", "logs", "mod.log")
let DEBUG = true
var tempFile = process.argv[2]
var data = fs.readFileSync(tempFile)
fs.rmSync(tempFile)


function log(val){
    if (!DEBUG)
        return
    let time = new Date()
    let timeString = time.toLocaleTimeString("en-GB")
    fs.writeFileSync(logfilePath, timeString + " - " + val + "\n")
}
  
exports.log = log
exports.data = data
exports.modPath = modPath
exports.tempPath = tempPath
exports.historyFile = historyFile
