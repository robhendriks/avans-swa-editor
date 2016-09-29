const ipc = require('electron').ipcRenderer

const editile = require('./libs/editile')
const editor = new editile.Editor()

editor.init({
  selector: '#editor',
  tools: [
    new editile.tools.Hand(),
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
    new editile.layers.Stats()
  ],
  sprites: [
    new editile.Sprite('a', 'assets/images/tiles.png', 4, 4)
  ],
  materials: [
    'dirt',
    'grass',
    'gravel',
    'stone',
    'stonebrick', 'stonebrick-1', 'stonebrick-2',
    'sand',
    'sandstone', 'sandstone-1', 'sandstone-2',
    'brick',
    'water'
  ],
  objects: [
    {
      id: 'road-cap',
      name: 'Road Cap',
      size: {x: 1, y: 1},
      variants: 4,
      spriteId: 'roadcp'
    },
    {
      id: 'road-straight',
      name: 'Road Straight',
      size: {x: 1, y: 1},
      variants: 2,
      spriteId: 'road'
    },
    {
      id: 'road-junction',
      name: 'Road Junction',
      size: {x: 1, y: 1},
      variants: 1,
      spriteId: 'roadj'
    },
    {
      id: 'road-t-junction',
      name: 'Road T-Junction',
      size: {x: 1, y: 1},
      variants: 4,
      spriteId: "roadtj"
    },
    {
      id: 'road-corner',
      name: 'Road Corner',
      size: {x: 1, y: 1},
      variants: 4,
      spriteId: 'roadc'
    },
    {
      id: 'building-a',
      name: 'Building Type A',
      size: {x: 2, y: 2},
      variants: 1,
      spriteId: 'blda'
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
