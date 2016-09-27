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

  let point = this._point
  let tile = world.getTileAt(point.x / Tile.WIDTH, point.y / Tile.HEIGHT)

  tile.type = 3
  editor.invalidate()
}

Pencil.prototype.mouseMove = function (evt, editor) {
}

util.inherits(Pencil, Tool)

exports.Pencil = Pencil
