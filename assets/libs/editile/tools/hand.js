const Tool = require('./tool').Tool
const Tile = require('../game/tile').Tile
const Box = require('../math/box').Box
const Vector = require('../math/vector').Vector

class Hand extends Tool {
  constructor () {
    super('hand', 'Hand', ['object'], ['hand.png', 5, 0])

    this._dragBegin = null
    this._dragEnd = null
    this._dragging = false
    this._dragBox = null
  }

  deactivate () {
    let world
    if ((world = editor.getWorld()) !== null) {
      world.getObjectLayer().deselectAll()
    }
    editor.invalidate(true)
  }

  _selectObject (editor) {
    let world
    if ((world = editor.getWorld()) === null || this._dragBegin === null) {
      return
    }

    let x = Math.floor(this._dragBegin.x / Tile.WIDTH)
    let y = Math.floor(this._dragBegin.y / Tile.HEIGHT)

    if (world.outOfBounds(x, y)) {
      return
    }

    let layer = world.getObjectLayer()
    layer.deselectAll()

    let obj = layer.getItemAt(new Vector(x, y))
    if (obj) {
      obj.select()
    }
  }

  _selectObjects (editor) {
    let world
    if ((world = editor.getWorld()) === null ||
        this._dragBegin === null ||
        this._dragEnd === null) {
      return
    }

    let layer = world.getObjectLayer()

    let a = this._dragBegin.clone().divideScalar(Tile.WIDTH).floor()
    let b = this._dragEnd.clone().divideScalar(Tile.WIDTH).floor()
    let area = new Box(a.clone().min(b), a.clone().max(b));

    for (let item of layer.getItems()) {
      item.selected = area.intersectsBox(item)
    }
  }

  mouseDown (event, editor) {
    if (this._dragging) {
      return
    }
    this._dragging = true
    this._dragBegin = editor.transformInput(event)
    this._selectObject(editor)

    editor.invalidate(true)
  }

  mouseUp (event, editor) {
    if (!this._dragging) {
      return
    }
    this._dragging = false
    this._dragBegin = this._dragEnd = this._dragBox = null

    editor.invalidate(true)
  }

  mouseMove (event, editor) {
    if (!this._dragging || !this._dragBegin) {
      return
    }
    this._dragEnd = editor.transformInput(event)
    this._dragBox = new Box(
      this._dragBegin.clone().min(this._dragEnd),
      this._dragBegin.clone().max(this._dragEnd))

    this._selectObjects(editor)
    editor.invalidate(true)
  }

  render (context) {
    let rect
    if ((rect = this._dragBox) === null) {
      return
    }

    let size = rect.getSize()

    context.strokeStyle = 'white'
    context.fillStyle = 'rgba(255, 255, 255, .1)'

    context.fillRect(rect.min.x, rect.min.y, size.x, size.y)

    context.beginPath()
    context.rect(rect.min.x, rect.min.y, size.x, size.y)
    context.stroke()
  }
}

exports.Hand = Hand
