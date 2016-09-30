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

  let mode
  if ((mode = editor.getMode()) !== null) {
    if (mode === 'tile') {
      /* Active material */
      let material
      if ((material = editor.getActiveMaterial()) !== null) {
        str += ' ('
        str += material.id
        str += '['
        str += material.index
        str += '])'
      }
    } else if (mode === 'object') {
      let obj
      if ((obj = editor.getActiveGameObject())) {
        str += ' ('
        str += obj
        str += ')'
      }
    }
  }

  ctx.fillText(str, 8, 22)
}

util.inherits(Stats, Layer)

exports.Stats = Stats
