const editile = require('./libs/editile')
const editor = new editile.Editor()

editor.init({
  selector: '#editor',
  tools: [
    new editile.tools.Hand(),
    new editile.tools.Brush(),
    new editile.tools.Pencil(),
    new editile.tools.Fill()
  ],
  layers: [
    new editile.layers.Grid(),
    new editile.layers.Axes(),
    new editile.layers.Tiles(),
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
  ]
})

editor.on('ready', function () {
  let world = new editile.World(16, 16)

  /*for (let y = 0; y < 16; y++) {
    for (let x = 0; x < 16; x++) {
      world.addTile(x, y, 1)
    }
  }*/

  this.setWorld(world)
})

window.editor = editor
