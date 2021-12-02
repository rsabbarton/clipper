const path = require('path')
const fs = require('fs')

class stashdoc {
  constructor(stashpath){
    this.stashPath = stashpath
    
    if (!fs.existsSync(this.stashPath) ){
      console.log('Path does not exist')
      console.log('Attempting to create ' + this.stashPath)
      this.createStash(this.stashPath)
    }
  }

  createStash(stashpath) {
    if (!fs.existsSync(stashpath)){
      console.log('creating stash at: ' + stashpath)
      fs.mkdirSync(stashpath)
      this.stashPath = stashpath
    }

  }

  saveIn(folder, name, json){
    if (!fs.existsSync(path.join(this.stashPath, folder))){
      console.log('creating folder at: ' + path.join(this.stashPath, folder))
      fs.mkdirSync(path.join(this.stashPath, folder))
    }
    console.log(this.stashPath)
    console.log(folder)
    console.log(name)
    this.writeJSONFile(path.join(this.stashPath, folder, name), json)
    return true
  }
  
  loadFrom(folder, name){
    if (!fs.existsSync(path.join(this.stashPath, folder, name))){
      console.log('No folder/file at: ' + path.join(this.stashPath, folder, name))
      return false
    } else {
      return this.loadJSONFile(path.join(this.stashPath, folder, name))
    }
  }
  
  loadJSONFile(filename) {
    var rawfile = fs.readFileSync(filename)
    if(rawfile){
      return JSON.parse(rawfile)
    } else {
      console.log('JSON File does not exist: ' + filename)
      return false
    }
  }

  writeJSONFile(filename, json) {
    fs.writeFileSync(filename, JSON.stringify(json))
  }

  updateJSONFile(filename, action, field, value){
    // TODO: Check for file existance and return appropriate errors
    var json = JSON.parse(fs.readFileSync(filename))
    switch(action){
      case "add":     json[field] = value
                      break
      case "update":  json[field] = value
                      break
      case "append":  json[field] += value
                      break
      case "remove":  json[field] = null
                      break
      case "listadditem": json[field].push(value)
                      break
      case "listremoveitem": json[field].splice(value)
                      break
      default:        console.log("Action: " + action + " not recognised")
                      return false
    }
    fs.writeFileSync(filename, JSON.stringify(json))
  }
  
}


exports.stashdoc = function(stashpath){
  var p = path.resolve(stashpath)
  return new stashdoc(p)
}



exports.version = function(){
  return '0.1.1'
}
