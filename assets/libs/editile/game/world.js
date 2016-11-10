const math = require('../utils/math')
const EventEmitter = require('events').EventEmitter
const Tile = require('./tile').Tile
const WorldLayer = require('./world-layer').WorldLayer

class World extends EventEmitter {
  constructor (width, height) {
    super()

    this.setWidth(width || World.MIN_SIZE)
    this.setHeight(height || World.MIN_SIZE)

    this._objectLayer = new WorldLayer(this)
    this._tileLayer = new WorldLayer(this)

    this._tiles = []
  }

  reset () {
    this._objectLayer.clear()
    this._tileLayer.clear()
    this._tiles = []
  }

  outOfBounds (x, y) {
    return ((x < 0 || x > this._width - 1) || (y < 0 || y > this._height - 1))
  }

  selectAll () {
    for (let tile of this._tiles) {
      tile.selected = true
    }
  }

  deselectAll () {
    for (let tile of this._tiles) {
      tile.selected = false
    }
  }

  invertSelection () {
    for (let tile of this._tiles) {
      tile.selected = !tile.selected
    }
  }

  getWidth () {
    return this._width
  }

  setWidth (newValue) {
    this._width = math.clamp(newValue, World.MIN_SIZE, World.MAX_SIZE)
    this.emit('resize')
  }

  getHeight () {
    return this._height
  }

  setHeight (newValue) {
    this._height = math.clamp(newValue, World.MIN_SIZE, World.MAX_SIZE)
    this.emit('resize')
  }

  getScreenWidth () {
    return this._width * Tile.WIDTH
  }

  getScreenHeight () {
    return this._height * Tile.HEIGHT
  }

  addTile (x, y, type) {
    if (!this.getTileAt(x, y)) {
      let tile = new Tile(x, y, type)
      this._tiles.push(tile)
      return tile
    }
    return false
  }

  deleteTile (x, y) {
    let index
    if ((index = this.getTileIndex(x, y)) !== -1) {
      this._tiles.splice(index, 1)
    }
  }

  getTileAt (x, y) {
    for (let i = 0, il = this._tiles.length; i < il; i++) {
      let tile = this._tiles[i]
      if (tile.x === x && tile.y === y) {
        return tile
      }
    }
    return false
  }

  getTileIndex (x, y) {
    for (let i = 0, il = this._tiles.length; i < il; i++) {
      let tile = this._tiles[i]
      if (tile.x === x && tile.y === y) {
        return i
      }
    }
    return -1
  }

  getTiles () {
    return this._tiles
  }

  setTiles (newValue) {
    this._tiles = newValue || []
  }

  getTileLayer () {
    return this._tileLayer
  }

  getObjectLayer () {
    return this._objectLayer
  }

  toString () {
    return 'World{width=' + this._width + ', height=' + this._height + '}'
  }
}

World.MIN_SIZE = 16
World.MAX_SIZE = 64

exports.World = World
