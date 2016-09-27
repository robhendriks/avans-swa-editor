const util = require('util')
const Layer = require('./layer').Layer
const Tile = require('../game/tile').Tile

const sprites = require('../game/sprite').sprites

function Axes () {
  Layer.call(this)
}

Axes.prototype.id = 'axes'
Axes.prototype.label = 'Axes'
Axes.prototype.zIndex = 2

Axes.prototype.render = function (ctx, rect, editor) {
  ctx.save()
  ctx.lineWidth = 1

  let world = editor.getWorld()

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

util.inherits(Axes, Layer)

exports.Axes = Axes
