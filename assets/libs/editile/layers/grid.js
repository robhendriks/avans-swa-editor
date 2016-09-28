const util = require('util')
const Layer = require('./layer').Layer
const Tile = require('../game/tile').Tile

function Grid () {
  Layer.call(this)
  this.on('update', this.update.bind(this))
}

Grid.prototype.id = 'grid'
Grid.prototype.label = 'Grid'
Grid.prototype.zIndex = 2

Grid.prototype.init = function (editor) {
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')

  this._canvas = canvas
  this._context = context

  this.update(editor)
}

Grid.prototype.update = function (editor) {
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
  ctx.strokeStyle = '#404040'

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

Grid.prototype.render = function (ctx, rect, editor) {
  ctx.drawImage(this._canvas, 0, 0)
}

util.inherits(Grid, Layer)

exports.Grid = Grid
