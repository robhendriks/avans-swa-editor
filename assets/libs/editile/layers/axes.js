const Layer = require('./layer').Layer

class Axes extends Layer {
  constructor () {
    super('axes', 'Axes', 4)
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

    // X-axis
    ctx.strokeStyle = '#FF4A4A'
    ctx.beginPath()
    ctx.moveTo(0, world.getScreenHeight() / 2)
    ctx.lineTo(world.getScreenWidth(), world.getScreenHeight() / 2)
    ctx.stroke()

    // Y-axis
    ctx.strokeStyle = '#4AFF4A'
    ctx.beginPath()
    ctx.moveTo(world.getScreenWidth() / 2, 0)
    ctx.lineTo(world.getScreenWidth() / 2, world.getScreenHeight())
    ctx.stroke()

    ctx.restore()
  }

  render (ctx, rect, editor) {
    ctx.drawImage(this._canvas, 0, 0)
  }
}

exports.Axes = Axes
