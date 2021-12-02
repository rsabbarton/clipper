const ipcRenderer = require("electron").ipcRenderer;



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
}

const clientApp = new clipperApp();