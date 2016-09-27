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
  this._tiles.push(new Tile(x, y, type))
}

World.prototype.getTileAt = function (x, y) {
  for (let i = 0, il = this._tiles.length; i < il; i++) {
    let tile = this._tiles[i]
    if (tile.x === x && tile.y === y) {
      return tile
    }
  }
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
