const util = require('util')
const Tool = require('./tool').Tool

function Fill () {
  Tool.call(this)
  this._point = null
}

Fill.prototype.id = 'fill'
Fill.prototype.label = 'Fill'
Fill.prototype.cursor = ['fill.png', 8, 8]
Fill.prototype.supportedModes = ['tile']

Fill.prototype._floodFill = function (world, x, y, src, dest) {
  if (src === dest) return
  if (world.outOfBounds(x, y)) return

  let tile = world.getTileAt(x, y)

  if ((src !== null && (!tile || tile.type !== src))
    || (src === null && tile)
    || (dest !== null && tile.type === dest)) {
    return
  }

  if (dest !== null) {
    if (src === null && !tile) {
      tile = world.addTile(x, y, -1)
    }
    tile.type = dest
  } else {
    world.deleteTile(x, y)
  }

  this._floodFill(world, x + 1, y, src, dest)
  this._floodFill(world, x, y + 1, src, dest)
  this._floodFill(world, x - 1, y, src, dest)
  this._floodFill(world, x, y - 1, src, dest)
}

Fill.prototype.mouseDown = function (evt, editor) {
  this._point = editor.snapInput(editor.transformInput(evt))
  this._button = evt.which
}

Fill.prototype.mouseUp = function (evt, editor) {
  let world, material
  if (((world = editor.getWorld()) === null) ||
      ((material = editor.getActiveMaterial())  === null) ||
      this._point === null) {
    return
  }

  let x = this._point.x / 32
  let y = this._point.y / 32

  if (world.outOfBounds(x, y)) {
    return
  }

  let tile = world.getTileAt(x, y)
  let src = (!tile ? null : tile.type)
  let dest = (this._button === 3 ? null : material.index) // CHANGE TO DYNAMIC MATERIAL FROM EDITOR ROB!!!!!

  this._floodFill(world, x, y, src, dest)

  editor.invalidate(true)

  this._point = null
  this._button = null
}

Fill.prototype.mouseMove = function (evt, editor) {
}

util.inherits(Fill, Tool)

exports.Fill = Fill
