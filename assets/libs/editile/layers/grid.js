const util = require('util')
const Layer = require('./layer').Layer
const Tile = require('../game/tile').Tile

function Grid () {
  Layer.call(this)
}

Grid.prototype.id = 'grid'
Grid.prototype.label = 'Grid'
Grid.prototype.zIndex = 1

Grid.prototype.render = function (ctx, rect, editor) {
  ctx.save()
  ctx.lineWidth = 1
  ctx.strokeStyle = '#404040'

  let world = editor.getWorld()

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

util.inherits(Grid, Layer)

exports.Grid = Grid
