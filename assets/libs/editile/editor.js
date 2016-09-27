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
  this._tool = null
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
    layer.init(this)
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

  canvas.addEventListener('mousedown', this._mouseDown.bind(this))
  canvas.addEventListener('mouseup', this._mouseUp.bind(this))
  canvas.addEventListener('mousemove', this._mouseMove.bind(this))

  this._canvas = canvas
  this._context = context

  let devicePixelRatio = window.devicePixelRatio || 1
  let backingStoreRatio = context.backingStorePixelRatio || 1
  this._ratio = devicePixelRatio / backingStoreRatio

  this._initUI()
  window.addEventListener('resize', this._resizeEditor.bind(this))
  this._resizeEditor()

  this.emit('ready')
}

Editor.prototype._initUI = function () {
  this._initToolUI()
  this._initZoomUI()
}

Editor.prototype._initToolUI = function () {
  let self = this
  let buttons = document.querySelectorAll('a[data-tool]')

  for (let button of buttons) {
    button.addEventListener('click', function (evt) {
      evt.preventDefault()

      buttons.forEach(function (btn) {
        btn.classList.remove('active')
      })

      button.classList.add('active')
      let toolId = button.getAttribute('data-tool')
      self.selectTool(toolId)
    })
  }

  if (buttons.length > 0) {
    buttons[0].click()
  }
}

Editor.prototype._initZoomUI = function () {
  let buttons = document.querySelectorAll('a[data-zoom]')
  for (let button of buttons) {
    let zoom = button.getAttribute('data-zoom')

    switch (zoom) {
      case 'in': this._wrapClick(button, this.zoomIn.bind(this)); break
      case 'out': this._wrapClick(button, this.zoomOut.bind(this)); break
      default: this._wrapClick(button, this.resetZoom.bind(this)); break
    }
  }
}

Editor.prototype._wrapClick = function (elem, fn) {
  elem.addEventListener('click', function (evt) {
    evt.preventDefault()
    fn()
  })
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

Editor.prototype._mouseDown = function (evt) {
}

Editor.prototype._mouseUp = function (evt) {
}

Editor.prototype._mouseMove = function (evt) {
}

Editor.prototype.invalidate = function () {
  this.render()
}

Editor.prototype.updateLayers = function () {
  for (let i = 0; i < this._layers.length; i++) {
    this._layers[i].emit('update', this)
  }
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

Editor.prototype.selectTool = function (toolId) {
  let tool = this.getTool(toolId)
  if (!tool) {
    throw new Error('invalid tool ID')
  }
  if (this._tool) {
    this._tool.deactivate(this)
  }
  this._tool = tool
  this._tool.activate(this)
}

Editor.prototype.getTool = function (toolId) {
  for (let tool of this._tools) {
    if (tool.id === toolId) {
      return tool
    }
  }
  return false
}

Editor.prototype.getTools = function () {
  return this._tools
}

Editor.prototype.getLayers = function () {
  return this._layers
}

Editor.prototype.getCanvas = function () {
  return this._canvas
}

Editor.prototype.getContext = function () {
  return this._context
}

Editor.prototype.getWorld = function () {
  return this._world
}

Editor.prototype.setWorld = function (newValue) {
  this._world = newValue
  this.updateLayers()
  this.invalidate()
}

util.inherits(Editor, EventEmitter)

exports.Editor = Editor
