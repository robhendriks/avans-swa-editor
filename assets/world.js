const util = require('./util')
const math = require('./math')
const Tile = require('./tile')

const MIN_SIZE = 16
const MAX_SIZE = 128

function World (width, height) {
  this.width = width || MIN_SIZE
  this.height = height || MIN_SIZE
}

World.prototype = {

  constructor: World,

  get width () {
    return this._width
  },

  set width (value) {
    if (!util.isPowerOfTwo(value)) {
      throw new Error('width must be a power of 2')
    }
    this._width = math.clamp(value, MIN_SIZE, MAX_SIZE)
  },

  get height () {
    return this._height
  },

  set height (value) {
    if (!util.isPowerOfTwo(value)) {
      throw new Error('height must be a power of 2')
    }
    this._height = math.clamp(value, MIN_SIZE, MAX_SIZE)
  },

  get clientWidth () {
    return this._width * Tile.WIDTH
  },

  get clientHeight () {
    return this._height * Tile.HEIGHT
  }

}

module.exports = World
