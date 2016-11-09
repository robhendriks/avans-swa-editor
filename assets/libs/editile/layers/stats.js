const Layer = require('./layer').Layer

class Stats extends Layer {
  constructor () {
    super('stats', 'Stats', 999)
    this.setRelative(false)
    this.setScalable(false)
  }

  init (editor) {
  }

  render (ctx, rect, editor) {
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
}

exports.Stats = Stats
