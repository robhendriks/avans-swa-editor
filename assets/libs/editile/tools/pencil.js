const util = require('util')
const Tool = require('./tool').Tool
const Tile = require('../game/tile').Tile
const Factory = require('../game/game-object').Factory

function Pencil () {
  Tool.call(this)
  this._point = null
}

Pencil.prototype.id = 'pencil'
Pencil.prototype.label = 'Pencil'
Pencil.prototype.cursor = ['pencil.png', 0, 16]
Pencil.prototype.supportedModes = ['tile', 'object']

Pencil.prototype.mouseDown = function (evt, editor) {
  this._point = editor.snapInput(editor.transformInput(evt))
}

Pencil.prototype.mouseUp = function (evt, editor) {
  let world, material
  if (((world = editor.getWorld()) === null) ||
      ((material = editor.getActiveMaterial())  === null) ||
      this._point === null) {
    return
  }

  let x = this._point.x / Tile.WIDTH
  let y = this._point.y / Tile.HEIGHT

  if (world.outOfBounds(x, y)) {
    return
  }

  let tile = world.getTileAt(x, y)

  if (editor.getMode() === 'tile') {
    // Distinguish mouse button
    if (evt.which === 1) {
      if (!tile) {
        tile = world.addTile(x, y, material.index)
      } else {
        tile.type = material.index
      }
    } else if (evt.which === 3 && tile) {
      world.deleteTile(tile.x, tile.y)
    }
  } else if (editor.getMode() === 'object') {
    let objId = editor.getActiveGameObject()
    let obj = Factory.createObject(objId, x, y)

    let layer = world.getObjectLayer()
    if (!layer.setItem(obj)) {
      console.warn('occupied')
    }
  }

  editor.invalidate(true)
}

Pencil.prototype.mouseMove = function (evt, editor) {
}

util.inherits(Pencil, Tool)

exports.Pencil = Pencil
