const util = require('util')
const Tool = require('./tool').Tool
const Vector = require('../math/vector').Vector
const Box = require('../math/box').Box

class Hand extends Tool {
  constructor() {
    super('hand', 'Hand', ['tile', 'object'], ['hand.png', 5, 0])

    this._dragBegin = null
    this._dragEnd = null
    this._dragging = false
    this._dragBox = null
  }

  mouseDown(event, editor) {
    if (this._dragging) {
      return
    }
    this._dragging = true
    this._dragBegin = editor.transformInput(event)
    editor.invalidate(true)
  }

  mouseUp(event, editor) {
    if (!this._dragging) {
      return
    }
    this._dragging = false
    this._dragBegin = this._dragEnd = this._dragBox = null

    editor.invalidate(true)
  }

  mouseMove(event, editor) {
    if (!this._dragging || !this._dragBegin) {
      return
    }
    this._dragEnd = editor.transformInput(event)
    this._dragBox = new Box(
      this._dragBegin.clone().min(this._dragEnd),
      this._dragBegin.clone().max(this._dragEnd))

    editor.invalidate(true)
  }

  render(context) {
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
