const util = require('util')
const async = require('async')
const EventEmitter = require('events').EventEmitter

function Editor () {
  EventEmitter.call(this)
  this._tools = []
  this._layers = []
  this._canvas = null
  this._context = null
  this._ratio = 0
  this._scale = 1
  this._width = 0
  this._height = 0
  this._world = null
}

Editor.prototype.init = function (options) {
  let self = this
  async.parallel([
    this._loadTools.bind(this, options['tools'] || []),
    this._loadLayers.bind(this, options['layers'] || []),
    this._loadSprites.bind(this, options['sprites'] || [])
  ], function () {
    self._initEditor(options)
  })
}

Editor.prototype._loadTools = function (tools, callback) {
  for (let tool of tools) {
    if (typeof tool !== 'object') {
      continue
    }
    this._tools.push(tool)
  }
  callback()
}

Editor.prototype._loadLayers = function (layers, callback) {
  for (let layer of layers) {
    if (typeof layer !== 'object') {
      continue
    }
    this._layers.push(layer)
  }

  this._layers.sort(function (a, b) {
    return a.zIndex - b.zIndex
  })

  callback()
}

Editor.prototype._loadSprites = function (sprites, callback) {
  let length = sprites.length
  let loaded = 0

  for (let i = 0; i < length; i++) {
    let sprite = sprites[0]
    if (typeof sprite !== 'object') {
      continue
    }

    sprite.load(function () {
      if (++loaded >= length) {
        callback()
      }
    })
  }
}

Editor.prototype._initEditor = function (options) {
  let selector = options['selector'] || '#editor'
  let canvas = document.querySelector(selector)
  let context = canvas.getContext('2d')

  if (!canvas || !context) {
    throw new Error('cannot initialize canvas')
  }

  this._canvas = canvas
  this._context = context

  let devicePixelRatio = window.devicePixelRatio || 1
  let backingStoreRatio = context.backingStorePixelRatio || 1
  this._ratio = devicePixelRatio / backingStoreRatio

  window.addEventListener('resize', this._resizeEditor.bind(this))
  this._resizeEditor()

  this.emit('ready')
}

Editor.prototype._resizeEditor = function (evt) {
  let canvas = this._canvas
  let parent = canvas.parentNode

  let width = this._width = parent.clientWidth
  let height = this._height = parent.clientHeight

  canvas.width = width * this._ratio
  canvas.height = height * this._ratio

  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  this.invalidate()
}

Editor.prototype.invalidate = function () {
  this.render()
  // TODO: ? moar shait
}

Editor.prototype.render = function () {
  let ctx = this._context

  let r = this._ratio
  let s = this._scale

  ctx.clearRect(0, 0, this._width, this._height)

  ctx.save()
  ctx.scale(r * s, r * s)

  let world
  if ((world = this._world) !== null) {
    let w = this._width
    let h = this._height

    let x = (w / 2 - world.getScreenWidth() * s / 2) / s
    let y = (h / 2 - world.getScreenHeight() * s / 2) / s

    ctx.save()
    ctx.translate(x, y)

    let rect = {
      x: x, y: y,
      w: w, h: h
    }

    for (let i = 0; i < this._layers.length; i++) {
      let layer = this._layers[i]
      layer.render(ctx, rect, this)
    }

    ctx.restore()
  }

  ctx.restore()
}

Editor.prototype.resetZoom = function () {
  this._scale = 1
  this.invalidate()
}

Editor.prototype.zoomOut = function () {
  this._scale = Math.max(this._scale - .125, .5)
  this.invalidate()
}

Editor.prototype.zoomIn = function () {
  this._scale = Math.min(this._scale + .25, 2)
  this.invalidate()
}

Editor.prototype.getTools = function () {
  return this._tools
}

Editor.prototype.getLayers = function () {
  return this._layers
}

Editor.prototype.getWorld = function () {
  return this._world
}

Editor.prototype.setWorld = function (newValue) {
  this._world = newValue
  this.invalidate()
}

util.inherits(Editor, EventEmitter)

exports.Editor = Editor
