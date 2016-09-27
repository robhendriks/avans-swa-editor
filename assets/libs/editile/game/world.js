const util = require('util')
const math = require('../utils/math')
const EventEmitter = require('events').EventEmitter
const Tile = require('./tile').Tile

function World (width, height) {
  EventEmitter.call(this)
  this.setWidth(width || World.MIN_SIZE)
  this.setHeight(height || World.MIN_SIZE)
  this._tiles = []
}

World.MIN_SIZE = 16
World.MAX_SIZE = 64

World.prototype.selectAll = function () {
  for (let tile of this._tiles) {
    tile.selected = true
  }
}

World.prototype.deselectAll = function () {
  for (let tile of this._tiles) {
    tile.selected = false
  }
}

World.prototype.invertSelection = function () {
  for (let tile of this._tiles) {
    tile.selected = !tile.selected
  }
}

World.prototype.getWidth = function () {
  return this._width
}

World.prototype.setWidth = function (newValue) {
  this._width = math.clamp(newValue, World.MIN_SIZE, World.MAX_SIZE)
  this.emit('resize')
}

World.prototype.getHeight = function () {
  return this._height
}

World.prototype.setHeight = function (newValue) {
  this._height = math.clamp(newValue, World.MIN_SIZE, World.MAX_SIZE)
  this.emit('resize')
}

World.prototype.getScreenWidth = function () {
  return this._width * Tile.WIDTH
}

World.prototype.getScreenHeight = function () {
  return this._height * Tile.HEIGHT
}

World.prototype.addTile = function (x, y, type) {
  if (!this.getTileAt(x, y)) {
    let tile = new Tile(x, y, type)
    this._tiles.push(tile)
    return tile
  }
  return false
}

World.prototype.deleteTile = function (x, y) {
  let index
  if ((index = this.getTileIndex(x, y)) !== -1) {
    this._tiles.splice(index, 1)
  }
}

World.prototype.getTileAt = function (x, y) {
  for (let i = 0, il = this._tiles.length; i < il; i++) {
    let tile = this._tiles[i]
    if (tile.x === x && tile.y === y) {
      return tile
    }
  }
  return false
}

World.prototype.getTileIndex = function (x, y) {
  for (let i = 0, il = this._tiles.length; i < il; i++) {
    let tile = this._tiles[i]
    if (tile.x === x && tile.y === y) {
      return i
    }
  }
  return -1
}

World.prototype.getTiles = function () {
  return this._tiles
}

World.prototype.setTiles = function (newValue) {
  this._tiles = newValue || []
}

World.prototype.toString = function () {
  return 'World{width=' + this._width + ', height=' + this._height + '}'
}

util.inherits(World, EventEmitter)

exports.World = World
