const util = require('util')
const Layer = require('./layer').Layer
const Tile = require('../game/tile').Tile

function Stats () {
  Layer.call(this)
  this.setRelative(false)
}

Stats.prototype.id = 'stats'
Stats.prototype.label = 'Stats'
Stats.prototype.zIndex = 999

Stats.prototype.init = function (editor) {
}

Stats.prototype.render = function (ctx, rect, editor) {
  let world
  if ((world = editor.getWorld()) === null) {
    return
  }

  ctx.font = '16px Open Sans'
  ctx.fillStyle = '#4a4a4a'

  let str = world.getWidth() + 'x' + world.getHeight()
  ctx.fillText(str, 8, 22)
}

util.inherits(Stats, Layer)

exports.Stats = Stats
