const util = require('util')
const Tool = require('./tool').Tool

function Brush () {
  Tool.call(this)
  this._dragging = null
  this._points = []
}

Brush.prototype.id = 'brush'
Brush.prototype.label = 'Brush'

Brush.prototype.activate = function (editor) {
  let canvas = editor.getCanvas()
  canvas.style.cursor = 'crosshair'
}

Brush.prototype.deactivate = function (editor) {
  console.log('>deactivate<')
}

Brush.prototype.mouseDown = function (evt, editor) {
  if (this._dragging) {
    return
  }
  this._dragging = true
  editor.invalidate(true)
}

Brush.prototype.mouseUp = function (evt, editor) {
  if (!this._dragging) {
    return
  }
  this._dragging = false
  this._points = []

  editor.invalidate(true)
}

Brush.prototype.mouseMove = function (evt, editor) {
  if (!this._dragging || !this._points) {
    return
  }
  let point = editor.transformInput(evt)
  this._points.push(point)
  editor.invalidate(true)
}

Brush.prototype.render = function (ctx) {
  ctx.strokeStyle = 'rgba(255, 255, 255, .5)'
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.lineWidth = 10

  ctx.beginPath()

  for (let i = 0, il = this._points.length; i < il; i++) {
    let point = this._points[i]
    if (i === il -1) {
      ctx.moveTo(point.x, point.y)
    } else {
      ctx.lineTo(point.x, point.y)
    }
  }

  ctx.closePath()
  ctx.stroke()
}

util.inherits(Brush, Tool)

exports.Brush = Brush
