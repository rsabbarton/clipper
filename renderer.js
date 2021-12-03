const ipcRenderer = require("electron").ipcRenderer;

class Clip {
    constructor(id, data){
        this.data = data;
        this.timestamp = Date.now();
        this.id = id;
        this.type = "text";
    }

    getHTMLElement(){

        var eList = document.createElement('div')
        var id = this.id;

        // var h = "";
        // h+="<div class=listcontainer>";
        // h+="<span class=samplecontainer>";
        // h+="<textarea class=sampletext>";
        // h+= this.data;
        // h+="</textarea>";
        // h+="</span>";
        // h+="<span class='menucontainer'>";
        // h+="<div class='clickable btn expand'><span class='oi' data-glyph='chevron-bottom' aria-hidden='true'></span></div>";
        // h+="<div class='clickable btn reclip'><span class='oi' data-glyph='clipboard' aria-hidden='true'></span></div>";
        // h+="<div class='clickable btn bookmark'><span class='oi' data-glyph='bookmark' aria-hidden='true'></span></div>";
        // h+="<div class='clickable btn menu'><span class='oi' data-glyph='menu' aria-hidden='true'></span></div>";
        // h+="";
        // h+="</span>";
        // h+="</div>";

        var h = `
<div id=listcontainer${id} class=listcontainer>
    <span id=samplecontainer${id} class=samplecontainer>
        <textarea id=sampletext${id} class=sampletext>
        ${this.data}
        </textarea>
    </span>
    <span id=menucontainer${id} class='menucontainer'>
        <div id=btnexpand${id} class='clickable btn expand' onclick="clipperApp.expand(${id});">
            <span class='oi' data-glyph='chevron-bottom' aria-hidden='true'></span>
        </div>
        <div id=btnreclip${id} class='clickable btn reclip' onclick="clipperApp.reclip(${id});">
            <span class='oi' data-glyph='clipboard' aria-hidden='true'></span>
        </div>
        <div id=btnbookmark${id} class='clickable btn bookmark' onclick="clipperApp.bookmark(${id});">
            <span class='oi' data-glyph='bookmark' aria-hidden='true'></span>
        </div>
        <div id=btnmenu${id} class='clickable btn menu' onclick="clipperApp.showMenu(${id});">
            <span class='oi' data-glyph='menu' aria-hidden='true'></span>
        </div>        
    </span>
</div>
        `

        eList.innerHTML = h;
        return eList;
    }
}

class clipperApp {
    constructor(){
        this.app = this;
        this.clipstore = [];
        this.app.init();
    }

    init(){
            
        this.setListeners();
    }

    setListeners(){
        ipcRenderer.on('newClip', function(event, data) {
            // this function never gets called
            clientApp.insertLatestClip(data);
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
        var clip = new Clip(this.clipstore.length, data);
        this.clipstore.push(clip);
        document.body.prepend(clip.getHTMLElement());
    }
}

const clientApp = new clipperApp();