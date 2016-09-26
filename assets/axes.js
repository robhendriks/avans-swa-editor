const util = require('util')
const Layer = require('./layer')
const Tile = require('./Tile')

function Axes () {
}

Axes.prototype = {

  constructor: Axes,

  _render: function (ctx, canvas) {
    let world = canvas.world

    // X-axis
    ctx.strokeStyle = '#DC0000'

    ctx.beginPath()
    ctx.moveTo(0, world.clientHeight / 2)
    ctx.lineTo(world.clientWidth, world.clientHeight / 2)
    ctx.stroke()

    // Y-axis
    ctx.strokeStyle = '#00DC00'

    ctx.beginPath()
    ctx.moveTo(world.clientWidth / 2, 0)
    ctx.lineTo(world.clientWidth / 2, world.clientHeight)
    ctx.stroke()
  }

}

util.inherits(Axes, Layer)

module.exports = Axes
