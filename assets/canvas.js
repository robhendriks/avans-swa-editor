const extend = require('extend')
const util = require('./util')
const World = require('./world')
const Tile = require('./tile')
const Grid = require('./grid')
const Axes = require('./axes')

function Canvas (options) {
  this._options = {
    id: 'canvas'
  }
  this._canvas = null
  this._context = null
  this._ratio = 0
  this._scale = 1
  this._width = 0
  this._height = 0
  this._world = null
  this._grid = new Grid()
  this._axes = new Axes()
}

Canvas.prototype = {

  constructor: Canvas,

  init: function (options) {
    extend(this._options, options || {})

    let id = this._options['id']
    let world = this._options['world']

    let canvas = document.getElementById(id)

    this._canvas = canvas
    this._context = canvas.getContext('2d')
    this._world = world

    this._registerEvents()
    this._resize()
  },

  _registerEvents: function () {
    window.addEventListener('resize', this._resize.bind(this))
  },

  _resize: function () {
    let parent = this._canvas.parentNode
    let w = this._width = parent.clientWidth
    let h = this._height = parent.clientHeight

    let r = this._ratio = util.getRatio(this._context)
    let canvas = this._canvas

    canvas.width = w * r
    canvas.height = h * r
    canvas.style.width = w + 'px'
    canvas.style.height = h + 'px'

    this._invalidate()
  },

  _invalidate: function () {
    this._render()
  },

  _render: function () {
    let ctx = this._context
    let r = this._ratio
    let s = this._scale

    ctx.save()
    ctx.scale(r * s, r * s)

    let world
    if ((world = this._world) !== null) {
      let w = this._width
      let h = this._height

      let x = (w / 2 - world.clientWidth * s / 2) / s
      let y = (h / 2 - world.clientHeight * s / 2) / s

      ctx.save()
      ctx.translate(x, y)

      this._grid.render(ctx, this)
      this._axes.render(ctx, this)

      ctx.restore()
    }

    ctx.restore()
  },

  get width () {
    return this._width
  },

  get height () {
    return this._height
  },

  get world () {
    return this._world
  },

  set world (value) {
    this._world = value
    this._invalidate()
  },

  get grid () {
    return this._grid
  }

}

module.exports = new Canvas()
