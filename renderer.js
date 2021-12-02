const ipcRenderer = require("electron").ipcRenderer;

class Clip {
    constructor(id, data){
        this.data = data;
        this.timestamp = Date.now();
        this.id = id;
        this.type = "text";
    }

    getHTML(){
        var h = "";
        h+="<div id="
    }
}

class clipperApp {
    constructor(){
        const app = this;
        
        app.init();
    }

    init(){
        document.body.innerHTML = "test text"

        this.setListeners();
    }

    setListeners(){
        ipcRenderer.on('newClip', function(event, data) {
            // this function never gets called
            document.body.innerHTML += data;
            console.log(data);
        });
        ipcRenderer.on('clipRefresh', function(event, data) {
            // this function never gets called
            console.log(data);
        });
    }

    getClips(){
        ipcRenderer.send("getAllClips");
    }


    insertLatestClip(data){
        var nDiv = document.createElement('div');
        nDiv.classList.add("listcontainer");
        
    }
}

const clientApp = new clipperApp();