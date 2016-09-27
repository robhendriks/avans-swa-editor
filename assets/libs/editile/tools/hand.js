const util = require('util')
const Tool = require('./tool').Tool
const Vector = require('../math/vector').Vector
const Box = require('../math/box').Box

function Hand () {
  Tool.call(this)
  this._dragBegin = null
  this._dragEnd = null
  this._dragging = false
  this._dragBox = null
}

Hand.prototype.id = 'hand'
Hand.prototype.label = 'Hand'

Hand.prototype.activate = function (editor) {
  let canvas = editor.getCanvas()
  canvas.style.cursor = 'pointer'
}

Hand.prototype.deactivate = function (editor) {
  console.log('>deactivate<')
}

Hand.prototype.mouseDown = function (evt, editor) {
  if (this._dragging) {
    return
  }
  this._dragging = true
  this._dragBegin = editor.transformInput(evt)
  editor.invalidate(true)
}

Hand.prototype.mouseUp = function (evt, editor) {
  if (!this._dragging) {
    return
  }
  this._dragging = false
  this._dragBegin = this._dragEnd = this._dragBox = null

  editor.invalidate(true)
}

Hand.prototype.mouseMove = function (evt, editor) {
  if (!this._dragging || !this._dragBegin) {
    return
  }
  this._dragEnd = editor.transformInput(evt)
  this._dragBox = new Box(
    this._dragBegin.clone().min(this._dragEnd),
    this._dragBegin.clone().max(this._dragEnd))

  editor.invalidate(true)
}

Hand.prototype.render = function (ctx) {
  let rect
  if ((rect = this._dragBox) === null) {
    return
  }

  let size = rect.getSize()

  ctx.strokeStyle = 'white'
  ctx.fillStyle = 'rgba(255, 255, 255, .1)'

  ctx.fillRect(rect.min.x, rect.min.y, size.x, size.y)

  ctx.beginPath()
  ctx.rect(rect.min.x, rect.min.y, size.x, size.y)
  ctx.stroke()
}

util.inherits(Hand, Tool)

exports.Hand = Hand
