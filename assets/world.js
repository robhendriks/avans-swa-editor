const util = require('util')
const Tile = require('./tile')
const EventEmitter = require('events').EventEmitter

const TILE_WIDTH = 32
const TILE_HEIGHT = 32

function World (width, height) {
  this._tiles = []
  this.width = width
  this.height = height
}

World.prototype = {
  constructor: World,

  addTile: function (tile) {
    this._tiles.push(tile || new Tile(0, 0))
  },

  get tiles () {
    return this._tiles
  },

  get width () {
    return this._width
  },

  set width (value) {
    this._width = value || 10
    this.emit('resize')
  },

  get height () {
    return this._height
  },

  set height (value) {
    this._height = value || 10
    this.emit('resize')
  },

  get tileWidth () {
    return TILE_WIDTH
  },

  get tileHeight () {
    return TILE_HEIGHT
  },

  get actualWidth () {
    return this._width * TILE_WIDTH
  },

  get actualHeight () {
    return this._height * TILE_HEIGHT
  }
}

util.inherits(World, EventEmitter)

module.exports = World
