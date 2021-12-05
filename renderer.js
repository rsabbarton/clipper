const ipcRenderer = require("electron").ipcRenderer;
const clipboard = require("electron").clipboard;

class Clip {
    constructor(id, data){
        this.data = data;
        this.timestamp = Date.now();
        this.id = id;
        this.type = "text";
    }

    pushHTML(){

        var eList = document.createElement('div');
        var id = this.id;

        var h = `
<div id=listcontainer${id} class=listcontainer>
    <span id=samplecontainer${id} class=samplecontainer>
        <textarea id=sampletext${id} class=sampletext>${this.data}</textarea>
    </span>
    <span id=menucontainer${id} class='menucontainer'>
        <div id=btnexpand${id} unsafe-inline class='clickable btn expand'>
            <span class='oi' data-glyph='chevron-bottom' aria-hidden='true'></span>
        </div>
        <div id=btnreclip${id} class='clickable btn reclip'>
            <span class='oi' data-glyph='clipboard' aria-hidden='true'></span>
        </div>
        <div id=btnbookmark${id} class='clickable btn bookmark'>
            <span class='oi' data-glyph='bookmark' aria-hidden='true'></span>
        </div>
        <div id=btnmenu${id} class='clickable btn menu'>
            <span class='oi' data-glyph='menu' aria-hidden='true'></span>
        </div>        
    </span>
</div>
        `

        eList.innerHTML = h;
        document.body.prepend(eList);
        document.getElementById('btnexpand'+id).onclick = (e)=>{clientApp.expand(id);}
        document.getElementById('btnreclip'+id).onclick = (e)=>{clientApp.reclip(id);}
        document.getElementById('btnbookmark'+id).onclick = (e)=>{clientApp.bookmark(id);}
        document.getElementById('btnmenu'+id).onclick = (e)=>{clientApp.showMenu(id);}
        return;
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
        clip.pushHTML();
    }

    expand(id){   
        console.log("expand clicked id: " + id)    
        //document.getElementById('listcontainer' + id).classList.toggle('expanded');
        document.getElementById('sampletext' + id).classList.toggle('expanded');
        //document.getElementById('sampletext' + id).classList.toggle('expanded');
   
    }

    reclip(id){
        console.log("reclip clicked. id: " + id);
        this.clipstore[id].data = document.getElementById('sampletext'+id).value;
        clipboard.writeText(this.clipstore[id].data);
        console.log("reclipped: " + this.clipstore[id].data);
    }

    bookmark(id){
        console.log("bookmark clicked. id: " + id);
    }

    showMenu(id){
        console.log("showMenu clicked. id: " + id);
    }
}

const clientApp = new clipperApp();