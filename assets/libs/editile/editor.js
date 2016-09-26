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

  ctx.save()
  ctx.scale(this._ratio * this._scale, this._ratio * this._scale)

  let x = 0
  let y = 0

  ctx.restore()
}

Editor.prototype.getTools = function () {
  return this._tools
}

Editor.prototype.getLayers = function () {
  return this._layers
}

util.inherits(Editor, EventEmitter)

exports.Editor = Editor
