const {remote, ipcRenderer, clipboard, Menu, MenuItem} = require("electron")
//const clipboard = require("electron").clipboard
//const remote = require('electron')
//const {Menu, MenuItem} = remote
//const MenuItem = remote.MenuItem

class Clip {
    constructor(id, data){
        this.data = data
        this.timestamp = Date.now()
        this.id = id
        this.type = "text"
    }

    pushHTML(){

        var eList = document.createElement('div')
        var id = this.id

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
        document.getElementById("pagecontainer").prepend(eList);
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
        ipcRenderer.on('apploaded', function(){
            console.log("adding input listener")
            document.getElementById('searchinput').onkeyup = clientApp.updateFilter
        })
        ipcRenderer.on('newClip', function(event, data) {
            clientApp.insertLatestClip(data);
        });
        ipcRenderer.on('deleteClips', function(event, data) {
            clientApp.deleteClip(data);
        });
        ipcRenderer.on('clipRefresh', function(event, data) {
            this.clipstore = [];
            document.getElementById("pagecontainer").innerHTML = ""
            data.forEach(element => {
                clientApp.insertLatestClip(element)
            });    
            
        });

        ipcRenderer.send("loaded", true);
        
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
        ipcRenderer.send("showmenu", this.clipstore[id].data)
    }

    updateFilter(){
        console.log("updating filter")
        var filter = document.getElementById('searchinput').value        
        var textitems = document.getElementsByClassName('sampletext')
        for (var i=0; i<textitems.length; i++){           
            var item = textitems.item(i)
            if(filter.length > 0){
                var itemvalue = item.value               
                if(itemvalue.toLowerCase().includes(filter.toLowerCase())){
                    item.parentElement.parentElement.style.display = "block"
                } else {
                    item.parentElement.parentElement.style.display = "none"
                }
            } else {
                item.parentElement.parentElement.style.display = "block";
            }
        }
    }

    deleteClip(data){
        //TODO - Add Delete Code
    }
}

const clientApp = new clipperApp();
        