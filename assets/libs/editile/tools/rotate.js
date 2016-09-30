const util = require('util')
const Tool = require('./tool').Tool
const Tile = require('../game/tile').Tile

function Rotate () {
  Tool.call(this)
}

Rotate.prototype.id = 'rotate'
Rotate.prototype.label = 'Rotate'
Rotate.prototype.cursor = ['rotate.png', 8, 8]
Rotate.prototype.supportedModes = ['object']

Rotate.prototype.mouseDown = function (evt, editor) {
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
  } else if(evt.which === 3) {
    obj.rotateRight()
  }
  editor.invalidate(true)
}

Rotate.prototype.mouseUp = function (evt, editor) {
}

Rotate.prototype.mouseMove = function (evt, editor) {
}

util.inherits(Rotate, Tool)

exports.Rotate = Rotate
