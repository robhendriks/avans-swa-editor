const Layer = require('./layer').Layer
const Tile = require('../game/tile').Tile

class Grid extends Layer {
  constructor () {
    super('grid', 'Grid', 2)
    this.on('update', this.update.bind(this))
  }

  init (editor) {
    let canvas = document.createElement('canvas')
    let context = canvas.getContext('2d')

    this._canvas = canvas
    this._context = context

    this.update(editor)
  }

  update (editor) {
    let ctx = this._context
    let canvas = this._canvas

    let world = editor.getWorld()
    if (world === null) {
      return
    }

    canvas.width = world.getScreenWidth()
    canvas.height = world.getScreenWidth()

    ctx.save()
    ctx.lineWidth = 1
    ctx.strokeStyle = '#535353'

    // X-axis
    for (let i = 0; i <= world.getWidth(); i++) {
      ctx.beginPath()
      ctx.moveTo(i * Tile.WIDTH, 0)
      ctx.lineTo(i * Tile.HEIGHT, world.getScreenWidth())
      ctx.stroke()
    }

    // Y-axis
    for (let i = 0; i <= world.getHeight(); i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * Tile.HEIGHT)
      ctx.lineTo(world.getScreenWidth(), i * Tile.HEIGHT)
      ctx.stroke()
    }

    ctx.restore()
  }

  render (ctx, rect, editor) {
    ctx.drawImage(this._canvas, 0, 0)
  }
}

exports.Grid = Grid
