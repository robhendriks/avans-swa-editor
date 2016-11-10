const Tool = require('./tool').Tool
const Tile = require('../game/tile').Tile

class Rotate extends Tool {
  constructor () {
    super('rotate', 'Rotate', ['object'], ['rotate.png', 8, 8])
    this._lastIndex = null
  }

  mouseDown (evt, editor) {
    let world
    if ((world = editor.getWorld()) === null) {
      return
    }

    let point = editor.snapInput(editor.transformInput(evt)).divideScalar(Tile.WIDTH)
    let layer = world.getObjectLayer()
    let obj = layer.getItemAt(point)

    if (obj === null) {
      console.warn('not occupied')
      return
    }

    if (evt.which === 1) {
      obj.rotateLeft()
    } else if (evt.which === 3) {
      obj.rotateRight()
    }

    this._lastIndex = obj.rotation
    editor.invalidate(true)
  }

  mouseUp (evt, editor) {
  }

  mouseMove (evt, editor) {
  }

  get lastIndex () {
    return this._lastIndex
  }
}

exports.Rotate = Rotate
