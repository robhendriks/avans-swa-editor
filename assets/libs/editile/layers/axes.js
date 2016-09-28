const util = require('util')
const Layer = require('./layer').Layer
const Tile = require('../game/tile').Tile

function Axes () {
  Layer.call(this)
  this.on('update', this.update.bind(this))
}

Axes.prototype.id = 'axes'
Axes.prototype.label = 'Axes'
Axes.prototype.zIndex = 3

Axes.prototype.init = function (editor) {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')

  this._canvas = canvas
  this._context = context

  this.update(editor)
}

Axes.prototype.update = function (editor) {
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
  ctx.strokeStyle = '#DC0000'
  ctx.beginPath()
  ctx.moveTo(0, world.getScreenHeight() / 2)
  ctx.lineTo(world.getScreenWidth(), world.getScreenHeight() / 2)
  ctx.stroke()

  // Y-axis
  ctx.strokeStyle = '#00DC00'
  ctx.beginPath()
  ctx.moveTo(world.getScreenWidth() / 2, 0)
  ctx.lineTo(world.getScreenWidth() / 2, world.getScreenHeight())
  ctx.stroke()

  ctx.restore()
}

Axes.prototype.render = function (ctx, rect, editor) {
  ctx.drawImage(this._canvas, 0, 0)
}

util.inherits(Axes, Layer)

exports.Axes = Axes
