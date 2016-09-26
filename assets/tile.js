function Tile (x, y, type) {
  this.x = x
  this.y = y
  this.type = type
}

Tile.prototype = {
  constructor: Tile,

  get x () {
    return this._x
  },

  set x (value) {
    this._x = value
  },

  get y () {
    return this._y
  },

  set y (value) {
    this._y = value
  },

  get type () {
    return this._type
  },

  set type (value) {
    this._type = value
  }
}

module.exports = Tile
