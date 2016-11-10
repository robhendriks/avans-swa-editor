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
    new editile.layers.GameObjects(),
    // new editile.layers.Stats()
  ],
  sprites: [
    new editile.Sprite('a', 'assets/images/tiles.png', 4, 4)
  ],
  materials: [
    'earth-a', 'earth-b',
    'ground-a', 'ground-b',
    'grass-a', 'grass-b', 'grass-c', 'grass-d',
    'sand-a', 'sand-b', 'sand-c',
    'rock-a', 'rock-b', 'rock-c',
    'concrete-a', 'concrete-b'
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
})

/* Save file button */
let saveButton = document.getElementById('save')
saveButton.addEventListener('click', function (evt) {
  ipc.send('save-file-dialog')
})

ipc.on('open-file-done', function (event, path) {
  console.log('open:', path)
})

ipc.on('save-file-done', function (event, path) {
  console.log('save:', path)
})

window.editor = editor
