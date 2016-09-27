const util = require('util')
const Tool = require('./tool').Tool
const Tile = require('../game/tile').Tile

function Pencil () {
  Tool.call(this)
  this._point = null
}

Pencil.prototype.id = 'pencil'
Pencil.prototype.label = 'Pencil'

Pencil.prototype.activate = function (editor) {
  let canvas = editor.getCanvas()
  canvas.style.cursor = 'crosshair'
}

Pencil.prototype.deactivate = function (editor) {
}

Pencil.prototype.mouseDown = function (evt, editor) {
  this._point = editor.snapInput(editor.transformInput(evt))
}

Pencil.prototype.mouseUp = function (evt, editor) {
  let world
  if ((world = editor.getWorld()) === null || this._point === null) {
    return
  }

  let x = this._point.x / Tile.WIDTH
  let y = this._point.y / Tile.HEIGHT

  if (world.outOfBounds(x, y)) {
    return
  }

  let tile = world.getTileAt(x, y)

  // Distinguish mouse button
  if (evt.which === 1) {
    if (!tile) {
      tile = world.addTile(x, y, 3)
    } else {
      tile.type = 3
    }
  } else if (evt.which === 3 && tile) {
    world.deleteTile(tile.x, tile.y)
  }

  editor.invalidate(true)
}

Pencil.prototype.mouseMove = function (evt, editor) {
}

util.inherits(Pencil, Tool)

exports.Pencil = Pencil
