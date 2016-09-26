const sprites = exports.sprites = {}

function Sprite (id, src) {
  this._id = id
  this._src = src
  this._image = null
  this._width = 0
  this._height = 0
  sprites[id] = this
}

Sprite.prototype.load = function (callback) {
  this._image = new Image()
  this._image.src = this._src

  let self = this
  this._image.onload = function () {
    self._width = this.width
    self._height = this.height
    callback()
  }
}

Sprite.prototype.getId = function () {
  return this._id
}

Sprite.prototype.getSrc = function () {
  return this._src
}

Sprite.prototype.getImage = function () {
  return this._image
}

Sprite.prototype.getWidth = function () {
  return this._width
}

Sprite.prototype.getHeight = function () {
  return this._height
}

exports.Sprite = Sprite
