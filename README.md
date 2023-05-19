# clipper
Clipboard Manager

## Installation

### Prerequisites for installing the Clipper Tool

 - git - You must have the git command line tools installed
 - node/npm - Once cloned you will need to use npm to sync dependencies

### Mac

1. Open "Terminal" App
2. Install electron: "sudo npm install -g electron"
3. Create an Apps folder in your documents
4. Change to this directory: "cd ~/Documents/Apps/"
5. Clone Clipper Repo: "git clone https://github.com/rsabbarton/clipper.git"
6. Change into the clipper folder: "cd ./clipper"
7. Install dependencies: "npm install"
8. Run Clipper App: "npm start"

## JSON Web Tools

If you wish to  add custom web tools then create an array of Name/URL pair arrays and save the file to ~/.clipper/json-web-tools.json

E.G.
[
  ["My Fave Search","https"://supersearch.com/?params=%s"]
]

Clip contents will be passed into the %s macro when clicked.

## Modding

It is now possible to add "mods" to the clipper application.  More details coming soon...