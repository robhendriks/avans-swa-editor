const util = require('util')
const Layer = require('./layer')
const Tile = require('./Tile')

function Grid () {
}

Grid.prototype = {

  constructor: Grid,

  _render: function (ctx, canvas) {
    let world = canvas.world

    ctx.lineWidth = 1
    ctx.strokeStyle = '#404040'

    // X-axis
    for (let i = 0; i <= world.width; i++) {
      ctx.beginPath()
      ctx.moveTo(i * Tile.WIDTH, 0)
      ctx.lineTo(i * Tile.HEIGHT, world.clientHeight)
      ctx.stroke()
    }

    // Y-axis
    for (let i = 0; i <= world.height; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * Tile.HEIGHT)
      ctx.lineTo(world.clientWidth, i * Tile.HEIGHT)
      ctx.stroke()
    }
  }

}

util.inherits(Grid, Layer)

module.exports = Grid
