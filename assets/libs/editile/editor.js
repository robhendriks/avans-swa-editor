const fs = require('fs')
const util = require('util')
const async = require('async')
const tileCase = require('title-case')

const Vector = require('./math/vector').Vector
const Tile = require('./game/tile').Tile

const World = require('./game/world').World
const Sprite = require('./game/sprite').Sprite
const SpriteRegistry = require('./game/sprite').Registry
const GameObjectFactory = require('./game/game-object').Factory

const EventEmitter = require('events').EventEmitter

const MODES = ['tile', 'object']

class Editor extends EventEmitter {
  constructor () {
    super()

    this._tools = []
    this._layers = []
    this._canvas = null
    this._context = null
    this._ratio = 0
    this._scale = 1
    this._x = 0
    this._y = 0
    this._width = 0
    this._screenWidth = 0
    this._height = 0
    this._screenHeight = 0
    this._world = null
    this._tool = null
    this._materials = null
    this._material = null
    this._materialsElem = null
    this._mode = null
    this._gameObjects = null
    this._gameObject = null
    this._path = null
  }

  reset () {
    this._path = null

    if (this._world !== null) {
      this._world.reset()
    }

    this.invalidate(true)
  }

  translateInput (evt) {
    let rect = this._canvas.getBoundingClientRect()
    return new Vector(
      Math.round((evt.clientX - rect.left) / (rect.right - rect.left) * this._width),
      Math.round((evt.clientY - rect.top) / (rect.bottom - rect.top) * this._height))
  }

  transformInput (evt) {
    let input = this.translateInput(evt)
    let scale = this._scale

    return new Vector(
      Math.round((input.x - this._x * scale) / scale),
      Math.round((input.y - this._y * scale) / scale))
  }

  snapInput (evt) {
    return new Vector(
      Tile.WIDTH * Math.floor((evt.x / Tile.WIDTH)),
      Tile.HEIGHT * Math.floor((evt.y / Tile.HEIGHT)))
  }

  init (options) {
    let self = this

    let sprites = this._injectSprites(options)

    async.parallel([
      this._loadTools.bind(this, options['tools'] || []),
      this._loadLayers.bind(this, options['layers'] || []),
      this._loadSprites.bind(this, sprites)
    ], function () {
      self._initEditor(options)
    })
  }

  _injectSprites (options) {
    let sprites = options['sprites'] || []
    let objs = options['objects'] || []

    console.info('injecting %s sprite(s)...', objs.length)

    for (let obj of objs) {
      if (!obj.id || !obj.size || !obj.spriteId) {
        console.warn('invalid object:', obj.id)
        continue
      }

      GameObjectFactory.addObject(obj)

      sprites.push(new Sprite(obj.spriteId, `assets/images/objects/${obj.id}.png`))
    }
    return sprites
  }

  _loadTools (tools, callback) {
    for (let tool of tools) {
      if (typeof tool !== 'object') {
        continue
      }
      this._tools.push(tool)
    }
    callback()
  }

  _loadLayers (layers, callback) {
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

  _loadSprites (sprites, callback) {
    let length = sprites.length
    let loaded = 0

    for (let i = 0; i < length; i++) {
      let sprite = sprites[i]
      if (typeof sprite !== 'object') {
        continue
      }

      sprite.load(function () {
        SpriteRegistry.register(sprite)

        if (++loaded >= length) {
          callback()
        }
      })
    }
  }

  _initEditor (options) {
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

    this._initUI(options)
    window.addEventListener('resize', this._resizeEditor.bind(this))
    this._resizeEditor()

    this.emit('ready')
  }

  _initUI (options) {
    this._initModeUI()
    this._initToolUI()
    this._initGameObjectUI(options)
    this._initMaterialUI(options)
    this._initZoomUI()
    this._initLayerUI()
  }

  _initToolUI () {
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

  _initModeUI () {
    let self = this

    let nodes = document.querySelectorAll('[data-mode]')
    for (let node of nodes) {
      node.addEventListener('click', function (evt) {
        evt.preventDefault()
        let mode = this.getAttribute('data-mode')
        self.setMode(mode)
      })
    }

    if (nodes.length > 0) {
      nodes[0].click()
    }
  }

  _initMaterialUI (options) {
    let materials = this._materials = options['materials'] || []

    let elem = this._materialsElem = document.getElementById('materials')
    let list = document.createElement('ul')

    for (let material of materials) {
      let listItem = document.createElement('li')
      listItem.setAttribute('data-material', material)

      let anchor = document.createElement('a')
      anchor.setAttribute('href', '#')

      let text = document.createTextNode(tileCase(material))
      let icon = document.createElement('i')
      icon.className = 'tile ' + material

      let self = this

      anchor.addEventListener('click', function (evt) {
        evt.preventDefault()

        let parent = this.parentNode
        let attr = parent.getAttribute('data-material')

        self.setMaterial(attr)
      })

      anchor.appendChild(icon)
      anchor.appendChild(text)
      listItem.appendChild(anchor)
      list.appendChild(listItem)
    }

    elem.appendChild(list)

    if (materials.length > 0) {
      this.setMaterial(materials[0])
    }
  }

  _initGameObjectUI (options) {
    let gameObjects = this._gameObjects = options['objects'] || []

    let elem = document.getElementById('gameObjects')
    let list = document.createElement('ul')

    for (let gameObject of gameObjects) {
      let listItem = document.createElement('li')
      listItem.setAttribute('data-game-object-id', gameObject.id)

      let anchor = document.createElement('a')
      anchor.setAttribute('href', '#')

      let sprite = SpriteRegistry.get(gameObject.spriteId)

      let imgSrc = sprite.getSrc()
      let ratio = 16 / sprite.getWidth()
      let imgWidth = 16
      let imgHeight = sprite.getHeight() * ratio

      anchor.innerHTML = `<i class="icon" style="background-image: url(${imgSrc}); background-size: ${imgWidth}px ${imgHeight}px;"></i> ` + gameObject.name

      let self = this

      anchor.addEventListener('click', function (evt) {
        evt.preventDefault()

        let parent = this.parentNode
        let gameObjectId = parent.getAttribute('data-game-object-id')

        self.setGameObject(gameObjectId)
      })

      listItem.appendChild(anchor)
      list.appendChild(listItem)
    }

    elem.appendChild(list)

    if (gameObjects.length > 0) {
      this.setGameObject(gameObjects[0].id)
    }
  }

  _initZoomUI () {
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

  _wrapClick (elem, fn) {
    let self = this
    elem.addEventListener('click', function (evt) {
      // Hack-a-doodle-doo
      self._canvas.width = self._canvas.width

      evt.preventDefault()
      fn()
    })
  }

  _initLayerUI () {
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

  _resizeEditor (evt) {
    let canvas = this._canvas
    let parent = canvas.parentNode

    let width = this._width = parent.clientWidth
    let height = this._height = parent.clientHeight

    this._screenWidth = canvas.width = width * this._ratio
    this._screenHeight = canvas.height = height * this._ratio

    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    this.invalidate()
  }

  _mouseDown (evt) {
    if (this._tool !== null &&
        this._tool.isModeSupported(this._mode)) {
      this._tool.mouseDown(evt, this)
    }
  }

  _mouseUp (evt) {
    if (this._tool !== null &&
        this._tool.isModeSupported(this._mode)) {
      this._tool.mouseUp(evt, this)
    }
  }

  _mouseMove (evt) {
    if (this._tool !== null &&
        this._tool.isModeSupported(this._mode)) {
      this._tool.mouseMove(evt, this)
    }
  }

  invalidate (clear) {
    if (clear === true) {
      this.clear()
    }
    this.render()
  }

  updateLayers () {
    for (let i = 0; i < this._layers.length; i++) {
      this._layers[i].emit('update', this)
    }
  }

  clear () {
    this._context.clearRect(0, 0, this._screenWidth, this._screenHeight)
  }

  render () {
    let ctx = this._context

    let r = this._ratio
    let s = this._scale

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
        if (layer.isVisible() || layer.ghost) {
          ctx.resetTransform()

          ctx.globalAlpha = 1.0

          // Ghost layer if requested
          if (!layer.isVisible() && layer.ghost) {
            ctx.globalAlpha = 0.2
          }

          // Scale layer if requested
          if (layer.isScalable()) {
            ctx.scale(r * s, r * s)
          } else {
            ctx.scale(r, r);
          }

          // Translate layer if requested
          if (layer.isRelative()) {
            ctx.translate(x, y)
          }

          layer.render(ctx, rect, this)
        }
      }

      ctx.resetTransform()

      ctx.scale(r * s, r * s)
      ctx.translate(x, y)

      if (this._tool) {
        this._tool.render(ctx)
      }

      ctx.resetTransform()
    }
  }

  resetZoom () {
    this._scale = 1
    this.invalidate()
  }

  zoomOut () {
    this._scale = Math.max(this._scale - .25, .5)
    this.invalidate()
  }

  zoomIn () {
    this._scale = Math.min(this._scale + .25, 2)
    this.invalidate()
  }

  setTool (toolId) {
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

    if (newTool.supportedModes.length === 1) {
      this.setMode(newTool.supportedModes[0])
    }

    this._setToolCursor(newTool)
    newTool.activate(this)
    this._tool = newTool
  }

  _setToolCursor (tool) {
    let cursor = tool.cursor
    if (cursor === null) {
      return
    } else if (tool._cursorCache) {
      this._canvas.style.cursor = tool._cursorCache
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

    tool._cursorCache = css
    this._canvas.style.cursor = css
  }

  saveWorld (path) {
    this._path = path

    if (this._world === null) {
      return
    }

    let tiles = this._world.getTiles()
    let objs = this._world.getObjectLayer().getItems()

    let _tiles = []
    let _objs = []

    /* TILES */
    for (let tile of tiles) {
      _tiles.push({
        type: tile.type,
        x: tile.x,
        y: tile.y
      })
    }

    /* OBJECTS */
    for (let obj of objs) {
      _objs.push({
        id: obj.id,
        x: obj.x,
        y: obj.y
      })
    }

    let root = {
      width: this._world.getWidth(),
      height: this._world.getHeight(),
      tiles: {
        count: _tiles.length,
        data: _tiles
      },
      objects: {
        count: _objs.length,
        data: _objs
      }
    }

    fs.writeFile(path, JSON.stringify(root, null, 2));
  }

  loadWorld (path) {
    this.reset()

    let self = this

    fs.readFile(path, (err, data) => {
      this._path = path

      if (err) {
        alert(err)
        return
      }

      let json

      try {
        json = JSON.parse(data)
      }  catch (err) {
        alert(err)
        return
      }

      let w = parseInt(json.width) || 16
      let h = parseInt(json.width) || 16

      let world = new World(w, h)

      let tiles = json.tiles.data
      let objs = json.objects.data

      /* TILES */
      for (let tile of tiles) {
        let x = parseInt(tile.x, 10)
        let y = parseInt(tile.y, 10)
        let t = parseInt(tile.type, 10)

        if (x < 0 || y < 0 || t < 0) {
          continue
        }

        world.addTile(x, y, t);
      }

      /* OBJECTS */
      for (let obj of objs) {
        let x = parseInt(obj.x, 10)
        let y = parseInt(obj.y, 10)
        let id = String(obj.id)

        if (x < 0 || y < 0) {
          continue
        }

        world.getObjectLayer().setItem(GameObjectFactory.createObject(id, x, y))
      }

      self.setWorld(world)
    })
  }

  getPath () {
    return this._path
  }

  getTool (toolId) {
    for (let tool of this._tools) {
      if (tool.id === toolId) {
        return tool
      }
    }
    return false
  }

  getTools () {
    return this._tools
  }

  getLayer (layerId) {
    for (let layer of this._layers) {
      if (layer.id === layerId) {
        return layer
      }
    }
    return false
  }

  getLayers () {
    return this._layers
  }

  getCanvas () {
    return this._canvas
  }

  getContext () {
    return this._context
  }

  getWorld () {
    return this._world
  }

  setWorld (newValue) {
    this._world = newValue
    this.updateLayers()
    this.invalidate(true)
  }

  getScale () {
    return this._scale
  }

  getScalePercent () {
    return Math.round(100.0 * this._scale)
  }

  getMaterials () {
    return this._materials
  }

  getMaterial (id) {
    let index = this._materials.indexOf(id)
    if (index !== -1) {
      return {
        id: id,
        index: index
      }
    }
    return null
  }

  getMaterialByIndex(index) {
    return this._materials[index] || null
  }

  getActiveMaterial () {
    return this._material
  }

  setMaterial (id, scrollTo) {
    let mat = this.getMaterial(id)
    if (mat === null) {
      console.warn('invalid material id:', id)
      return
    }

    let nodes = document.querySelectorAll('li[data-material]'), theNode
    if (nodes) {
      for (let node of nodes) {
        let attr = node.getAttribute('data-material')
        if (attr === id) {
          theNode = node
          node.classList.add('active')
        } else {
          node.classList.remove('active')
        }
      }
    }

    if (scrollTo === true && theNode) {
      this._materialsElem.scrollTop = theNode.offsetTop
    }
    this._material = mat
    this.setMode('tile')
  }

  getMode () {
    return this._mode
  }

  setMode (mode) {
    if (MODES.indexOf(mode) === -1) {
      console.warn('invalid mode:', mode)
      return
    }

    let nodes = document.querySelectorAll('[data-mode]')
    for (let node of nodes) {
      let nodeMode = node.getAttribute('data-mode')
      if (nodeMode === mode) {
        node.classList.add('active')
      } else {
        node.classList.remove('active')
      }
    }

    this._mode = mode
    this.invalidate(true)
  }

  getGameObject (gameObjectId) {
    for (let gameObject of this._gameObjects) {
      if (gameObject.id === gameObjectId) {
        return gameObject
      }
    }
    return null
  }

  getActiveGameObject () {
    return this._gameObject
  }

  setGameObject (gameObjectId) {
    let gameObject
    if ((gameObject = this.getGameObject(gameObjectId)) == null) {
      console.warn('invalid game object ID:', gameObjectId)
      return
    }

    let nodes = document.querySelectorAll('[data-game-object-id]')
    for (let node of nodes) {
      let nodeGameObjectId = node.getAttribute('data-game-object-id')
      if (nodeGameObjectId === gameObjectId) {
        node.classList.add('active')
      } else {
        node.classList.remove('active')
      }
    }

    this._gameObject = gameObject.id
    this.setMode('object')
  }
}

exports.Editor = Editor
