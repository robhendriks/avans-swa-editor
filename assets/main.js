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
  ],
  sprites: [
    new editile.Sprite(0, 'assets/images/tiles.png', 4, 4)
  ]
})

editor.on('ready', function () {
  let zoomReset = document.getElementById('zoomReset')
  let zoomOut = document.getElementById('zoomOut')
  let zoomIn = document.getElementById('zoomIn')

  zoomReset.addEventListener('click', function (evt) {
    evt.preventDefault()
    editor.resetZoom()
  })

  zoomOut.addEventListener('click', function (evt) {
    evt.preventDefault()
    editor.zoomOut()
  })

  zoomIn.addEventListener('click', function (evt) {
    evt.preventDefault()
    editor.zoomIn()
  })

  this.setWorld(new editile.World())
})

window.editor = editor
