const util = require('util')
const Tool = require('./tool').Tool

function Brush () {
  Tool.call(this)
  this._dragging = null
  this._stroke = null
  this._points = []
  this._prev = null
}

Brush.prototype.id = 'brush'
Brush.prototype.label = 'Brush'

Brush.prototype._addPoint = function (point) {
  if (this._points.length >= 20) {
    this._points.shift()
  }
  this._points.push(point)
}

Brush.prototype.activate = function (editor) {
  let canvas = editor.getCanvas()
  canvas.style.cursor = 'crosshair'
}

Brush.prototype.deactivate = function (editor) {
}

Brush.prototype.mouseDown = function (evt, editor) {
  if (this._dragging) {
    return
  }
  this._dragging = true
  this._stroke = (evt.which === 3
    ? 'rgba(86, 0, 0, .3)'
    : 'rgba(0, 86, 0, .3')

  editor.invalidate(true)
}

Brush.prototype.mouseUp = function (evt, editor) {
  if (!this._dragging) {
    return
  }
  this._dragging = false
  this._stroke = null
  this._points = []
  this._prev = null

  editor.invalidate(true)
}

Brush.prototype.mouseMove = function (evt, editor) {
  if (!this._dragging || !this._points) {
    return
  }

  let point = editor.transformInput(evt)
  this._addPoint(point)

  let world
  if ((world = editor.getWorld()) !== null) {
    let point = editor.snapInput(editor.transformInput(evt))
    let x = point.x / 32
    let y = point.y / 32

    if (!world.outOfBounds(x, y)) {
      if (this._prev === null || !this._prev.equals(point)) {
        let tile = world.getTileAt(x, y)

        // Distinguish mouse button
        if (evt.which === 1) {
          if (!tile) {
            world.addTile(x, y, 12)
          } else {
            tile.type = 12
          }
        } else if (evt.which === 3 && tile) {
          world.deleteTile(tile.x, tile.y)
        }

        this._prev = point
      }
    }
  }

  editor.invalidate(true)
}

Brush.prototype.render = function (ctx) {
  ctx.strokeStyle = this._stroke
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.lineWidth = 8

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
