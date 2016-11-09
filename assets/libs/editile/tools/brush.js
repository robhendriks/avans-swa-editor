const Tool = require('./tool').Tool
const Factory = require('../game/game-object').Factory

class Brush extends Tool {
  constructor () {
    super('brush', 'Brush', ['tile', 'object'], ['brush.png', 1, 15])

    this._dragging = null
    this._stroke = null
    this._points = []
    this._prev = null
  }

  _addPoint (point) {
    if (this._points.length >= 20) {
      this._points.shift()
    }
    this._points.push(point)
  }

  mouseDown (evt, editor) {
    if (this._dragging || editor.getActiveMaterial() == null) {
      return
    }
    this._dragging = true
    this._stroke = (evt.which === 3
      ? 'rgba(86, 0, 0, .3)'
      : 'rgba(0, 86, 0, .3')

    editor.invalidate(true)
  }

  mouseUp (evt, editor) {
    if (!this._dragging) {
      return
    }

    this._dragging = false
    this._stroke = null
    this._points = []
    this._prev = null

    editor.invalidate(true)
  }

  mouseMove (evt, editor) {
    if (!this._dragging || !this._points) {
      return
    }

    let mat = editor.getActiveMaterial()
    let point = editor.transformInput(evt)
    this._addPoint(point)

    let world
    if ((world = editor.getWorld()) !== null) {
      let point = editor.snapInput(editor.transformInput(evt))
      let x = point.x / 32
      let y = point.y / 32

      if (!world.outOfBounds(x, y)) {
        if (this._prev === null || !this._prev.equals(point)) {
          if (editor.getMode() === 'tile') {
            let tile = world.getTileAt(x, y)
            if (evt.which === 1) {
              if (!tile) {
                world.addTile(x, y, mat.index)
              } else {
                tile.type = mat.index
              }
            } else if (evt.which === 3 && tile) {
              world.deleteTile(tile.x, tile.y)
            }
          } else if (editor.getMode() === 'object') {
            let layer = world.getObjectLayer()

             // Distinguish mouse button
            if (evt.which === 1) {
              let objId = editor.getActiveGameObject()
              let obj = Factory.createObject(objId, x, y)

              if (!layer.setItem(obj)) {
                console.warn('occupied')
              }
            } else if (evt.which === 3) {
              if (!layer.unsetItemAt(x, y)) {
                console.warn('not occupied')
              }
            }
          }

          this._prev = point
        }
      }
    }

    editor.invalidate(true)
  }

  render (ctx) {
    ctx.strokeStyle = this._stroke
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.lineWidth = 8

    ctx.beginPath()

    for (let i = 0, il = this._points.length; i < il; i++) {
      let point = this._points[i]
      if (i === il - 1) {
        ctx.moveTo(point.x, point.y)
      } else {
        ctx.lineTo(point.x, point.y)
      }
    }

    ctx.stroke()
  }
}

exports.Brush = Brush
