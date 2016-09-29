const util = require('util')
const Tool = require('./tool').Tool
const Tile = require('../game/tile').Tile

function Picker () {
  Tool.call(this)
  this._point = null
}

Picker.prototype.id = 'picker'
Picker.prototype.label = 'Picker'
Picker.prototype.cursor = ['picker.png', 0, 16]
Picker.prototype.supportedModes = ['tile']

Picker.prototype.mouseDown = function (evt, editor) {
  this._point = editor.snapInput(editor.transformInput(evt))
}

Picker.prototype.mouseUp = function (evt, editor) {
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

Picker.prototype.mouseMove = function (evt, editor) {
}

util.inherits(Picker, Tool)

exports.Picker = Picker
