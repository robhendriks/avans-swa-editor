const editile = require('./libs/editile')
const editor = new editile.Editor()

editor.init({
  selector: '#editor',
  tools: [
    new editile.tools.Hand(),
    new editile.tools.Brush()
  ],
  layers: [
    new editile.layers.Grid(),
    new editile.layers.Axes(),
    new editile.layers.Tiles(),
    new editile.layers.Stats()
  ],
  sprites: [
    new editile.Sprite(0, 'assets/images/tiles.png', 4, 4)
  ]
})

editor.on('ready', function () {
  this.setWorld(new editile.World(16, 16))
})

window.editor = editor
