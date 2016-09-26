const editile = require('./libs/editile')
const editor = new editile.Editor()

editor.init({
  tools: [
    new editile.tools.Hand(),
    new editile.tools.Brush()
  ],
  layers: [
    new editile.layers.Grid(),
    new editile.layers.Tiles()
  ],
  sprites: [
    new editile.Sprite(0, 'assets/images/tiles.png')
  ]
})

window.editor = editor
