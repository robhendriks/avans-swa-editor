const util = require('util')
const Layer = require('./layer').Layer
const Tile = require('../game/tile').Tile

function Stats () {
  Layer.call(this)
  this.setRelative(false)
  this.setScalable(false)
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

  ctx.font = '16px bfont'
  ctx.fillStyle = '#4a4a4a'

  let str = ''

  /* World dimensions */
  str += world.getWidth()
  str += 'x'
  str += world.getHeight()

  /* Zoom level */
  str += ' ('
  str += editor.getScalePercent()
  str += '%)'

  ctx.fillText(str, 8, 22)
}

util.inherits(Stats, Layer)

exports.Stats = Stats
