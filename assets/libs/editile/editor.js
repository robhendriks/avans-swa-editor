const util = require('util')
const async = require('async')
const EventEmitter = require('events').EventEmitter
const Vector = require('./math/vector').Vector
const Tile = require('./game/tile').Tile

function Editor () {
  EventEmitter.call(this)
  this._tools = []
  this._layers = []
  this._canvas = null
  this._context = null
  this._ratio = 0
  this._scale = 1
  this._x = 0
  this._y = 0
  this._width = 0
  this._height = 0
  this._world = null
  this._tool = null
}

Editor.prototype.translateInput = function (evt) {
  let rect = this._canvas.getBoundingClientRect()
  return new Vector(
    Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * this._width),
    Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * this._height))
}

Editor.prototype.transformInput = function (evt) {
  let input = this.translateInput(evt)
  let zoom = this._ratio * this._scale

  return new Vector(
    Math.round((input.x - this._x * zoom) / zoom),
    Math.round((input.y - this._y * zoom) / zoom))
}

Editor.prototype.snapInput = function (evt) {
  return new Vector(
    Tile.WIDTH * Math.floor((evt.x / Tile.WIDTH)),
    Tile.HEIGHT * Math.floor((evt.y / Tile.HEIGHT)))
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
    layer.on('visibility changed', this.invalidate.bind(this, true))
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
  this._initLayerUI()
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
      self.setTool(toolId)
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
  let self = this
  elem.addEventListener('click', function (evt) {
    // Hack-a-doodle-doo
    self._canvas.width = self._canvas.width

    evt.preventDefault()
    fn()
  })
}

Editor.prototype._initLayerUI = function () {
  let buttons = document.querySelectorAll('a[data-layer]')
  for (let button of buttons) {
    let layerId = button.getAttribute('data-layer')
    let layer
    if (!(layer = this.getLayer(layerId))) {
      console.warn('invalid layer ID:', layerId)
      continue
    }
    if (layer.isVisible()) {
      button.classList.add('active')
    }
    let self = this
    button.addEventListener('click', function (evt) {
      evt.preventDefault()
      layer.setVisible(!layer.isVisible())
      button.classList.toggle('active')
    })
  }
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
  if (this._tool !== null) {
    this._tool.mouseDown(evt, this)
  }
}

Editor.prototype._mouseUp = function (evt) {
  if (this._tool !== null) {
    this._tool.mouseUp(evt, this)
  }
}

Editor.prototype._mouseMove = function (evt) {
  if (this._tool !== null) {
    this._tool.mouseMove(evt, this)
  }
}

Editor.prototype.invalidate = function (clear) {
  if (clear === true) {
    this.clear()
  }
  this.render()
}

Editor.prototype.updateLayers = function () {
  for (let i = 0; i < this._layers.length; i++) {
    this._layers[i].emit('update', this)
  }
}

Editor.prototype.clear = function () {
  this._context.clearRect(0, 0, this._width, this._height)
}

Editor.prototype.render = function () {
  let ctx = this._context

  let r = this._ratio
  let s = this._scale

  ctx.save()
  ctx.scale(r, r)

  let world
  if ((world = this._world) !== null) {
    let w = this._width
    let h = this._height

    let x = Math.round(this._x = (w / 2 - world.getScreenWidth() * s / 2) / s)
    let y = Math.round(this._y = (h / 2 - world.getScreenHeight() * s / 2) / s)

    let rect = {
      x: x, y: y,
      w: w, h: h
    }

    for (let i = 0; i < this._layers.length; i++) {
      let layer = this._layers[i]
      if (layer.isVisible()) {
        ctx.save()

        // Scale layer if requested
        if (layer.isScalable()) {
          ctx.scale(s, s)
        }

        // Translate layer if requested
        if (layer.isRelative()) {
          ctx.translate(x, y)
        }

        layer.render(ctx, rect, this)
        ctx.restore()
      }
    }

    ctx.save()
    ctx.scale(s, s)
    ctx.translate(x, y)

    if (this._tool) {
      this._tool.render(ctx)
    }

    ctx.restore()
    ctx.restore()
  }
}

Editor.prototype.resetZoom = function () {
  this._scale = 1
  this.invalidate()
}

Editor.prototype.zoomOut = function () {
  this._scale = Math.max(this._scale - .25, .5)
  this.invalidate()
}

Editor.prototype.zoomIn = function () {
  this._scale = Math.min(this._scale + .25, 2)
  this.invalidate()
}

Editor.prototype.setTool = function (toolId) {
  let newTool = this.getTool(toolId)
  if (!newTool) {
    console.warn('invalid tool ID:', toolId)
    return
  }

  let oldTool
  if ((oldTool = this._tool)) {
    if (oldTool.cursor !== null) {
      this._canvas.style.cursor = 'auto'
    }
    oldTool.deactivate(this)
  }
  this._setToolCursor(newTool)
  newTool.activate(this)
  this._tool = newTool
}

Editor.prototype._setToolCursor = function (tool) {
  let cursor = tool.cursor
  if (cursor === null) {
    return
  }

  let src, x, y
  src = x = y = null

  if (Array.isArray(cursor)) {
    src = cursor[0] || 'default.png'
    x = cursor[1] || 0
    y = cursor[2] || 0
  } else if (typeof cursor === 'string') {
    src = cursor
  } else {
    console.warn('invalid cusor for tool \'%s\'', tool.id)
    return
  }

  let css = 'url(assets/images/cursors/'
  css += src + ')'

  if (x !== null && y !== null) {
    css += ' ' + x
    css += ' ' + y
  }
  css += ', auto'

  this._canvas.style.cursor = css
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

Editor.prototype.getLayer = function (layerId) {
  for (let layer of this._layers) {
    if (layer.id === layerId) {
      return layer
    }
  }
  return false
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

Editor.prototype.getScale = function () {
  return this._scale
}

Editor.prototype.getScalePercent = function () {
  return Math.round(100.0 * this._scale)
}

util.inherits(Editor, EventEmitter)

exports.Editor = Editor
