const Tool = require('./tool').Tool
const Tile = require('../game/tile').Tile

class Picker extends Tool {
  constructor () {
    super('picker', 'Picker', ['tile'], ['picker.png', 0, 16])
    this._point = null
  }

  mouseDown (evt, editor) {
    this._point = editor.snapInput(editor.transformInput(evt))
  }

  mouseUp (evt, editor) {
    let world
    if (((world = editor.getWorld()) === null) || this._point === null) {
      return
    }

    let x = this._point.x / Tile.WIDTH
    let y = this._point.y / Tile.HEIGHT

    if (world.outOfBounds(x, y)) {
      return
    }

    let tile
    if ((tile = world.getTileAt(x, y)) === false) {
      console.warn('no tile found at: %s:%s', x, y)
      return
    }

    let material
    if ((material = editor.getMaterialByIndex(tile.type)) === null) {
      console.warn('no material for tile: %s:%s', x, y)
      return
    }

    editor.setMaterial(material, true)

    this._point = null
  }

  mouseMove (evt, editor) {
  }
}

exports.Picker = Picker
