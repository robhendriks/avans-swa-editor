const ipc = require('electron').ipcRenderer

const editile = require('./libs/editile')
const editor = new editile.Editor()

editor.init({
  selector: '#editor',
  tools: [
    new editile.tools.Hand(),
    new editile.tools.Rotate(),
    new editile.tools.Brush(),
    new editile.tools.Pencil(),
    new editile.tools.Fill(),
    new editile.tools.Picker()
  ],
  layers: [
    new editile.layers.Grid(),
    new editile.layers.Axes(),
    new editile.layers.Tiles(),
    new editile.layers.GameObjects()
  ],
  sprites: [
    new editile.Sprite('a', 'assets/images/tiles.png', 4, 4)
  ],
  materials: [
    'water',
    'dirt-1', 'dirt-2', 'dirt-3',
    'grass-1', 'grass-2', 'grass-3', 'grass-4',
    'sand-1', 'sand-2', 'sand-3', 'sand-4',
    'rock-1', 'rock-2', 'rock-3', 'rock-4'
  ],
  objects: [
    {
      id: 'road-cap',
      name: 'Road Cap',
      size: {x: 1, y: 1},
      spriteId: 'roadcp',
      graph: {
        nodes: ['S']
      }
    },
    {
      id: 'road-straight',
      name: 'Road Straight',
      size: {x: 1, y: 1},
      spriteId: 'road',
      graph: {
        nodes: ['N', 'S']
      }
    },
    {
      id: 'road-junction',
      name: 'Road Junction',
      size: {x: 1, y: 1},
      spriteId: 'roadj',
      graph: {
        nodes: ['N', 'E', 'S', 'W']
      }
    },
    {
      id: 'road-t-junction',
      name: 'Road T-Junction',
      size: {x: 1, y: 1},
      spriteId: 'roadtj',
      graph: {
        nodes: ['E', 'S', 'W']
      }
    },
    {
      id: 'road-corner',
      name: 'Road Corner',
      size: {x: 1, y: 1},
      spriteId: 'roadc',
      graph: {
        nodes: ['E', 'S']
      }
    },
    {
      id: 'building-a',
      name: 'Building Type A',
      size: {x: 2, y: 2},
      spriteId: 'blda'
    },
    {
      id: 'building-b',
      name: 'Building Type B',
      size: {x: 2, y: 2},
      spriteId: 'bldb'
    }
  ]
})

editor.on('ready', function () {
  let world = new editile.World(16, 16)
  this.setWorld(world)
})

/* Open file button */
let openButton = document.getElementById('open')
openButton.addEventListener('click', function (evt) {
  evt.preventDefault()
  ipc.send('open-file-dialog')
})

/* New file button */
let newButton = document.getElementById('new')
newButton.addEventListener('click', function (evt) {
  evt.preventDefault()
  editor.reset()
})

/* Save file button */
let saveButton = document.getElementById('save')
saveButton.addEventListener('click', function (evt) {
  let path
  if ((path = editor.getPath()) !== null) {
    editor.saveWorld(path)
  } else {
    ipc.send('save-file-dialog')
  }
})

ipc.on('open-file-done', function (event, paths) {
  editor.loadWorld(paths[0])
})

ipc.on('save-file-done', function (event, path) {
  console.log(path)
  editor.saveWorld(path)
})

window.editor = editor
