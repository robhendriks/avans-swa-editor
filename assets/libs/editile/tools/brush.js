const Tool = require('./tool').Tool
const Factory = require('../game/game-object').Factory

class Brush extends Tool {
  constructor () {
    super('brush', 'Brush', ['tile', 'object'], ['brush.png', 1, 15])

    this._dragging = null
    this._stroke = null
    this._point = null
    this._prev = null
  }

  mouseDown (evt, editor) {
    if (this._dragging || editor.getActiveMaterial() == null) {
      return
    }

    this._point = editor.transformInput(evt)
    this._dragging = true
    this._stroke = (evt.which === 3
      ? 'rgba(255, 74, 74, .3)'
      : 'rgba(74, 255, 74, .3')

    editor.invalidate(true)
  }

  mouseUp (evt, editor) {
    if (!this._dragging) {
      return
    }

    this._dragging = false
    this._stroke = null
    this._point = null
    this._prev = null

    editor.invalidate(true)
  }

  mouseMove (evt, editor) {
    if (!this._dragging || !this._point) {
      return
    }

    let mat = editor.getActiveMaterial()
    this._point = editor.transformInput(evt)

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

              let rotateTool
              if ((rotateTool = editor.getTool('rotate')) !== null) {
                obj.rotation = rotateTool.lastIndex
              }

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
    if (!this._point) {
      return
    }

    ctx.strokeStyle = this._stroke
    ctx.lineWidth = 3

    ctx.beginPath()
    ctx.ellipse(this._point.x, this._point.y, 16, 16, 0, 0, 2 * Math.PI)
    ctx.stroke()
  }
}

exports.Brush = Brush
