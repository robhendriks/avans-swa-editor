function Sprite (id, src, rows, columns) {
  this._id = id
  this._src = src
  this._rows = rows
  this._columns = columns
  this._image = null
  this._width = 0
  this._columnWidth = 0
  this._height = 0
  this._rowHeight = 0
}

Sprite.prototype.load = function (callback) {
  this._image = new Image()
  this._image.src = this._src

  let self = this
  this._image.onload = function () {
    let w = self._width = this.width
    let h = self._height = this.height
    self._columnWidth = w / self._columns
    self._rowHeight = h / self._rows
    callback()
  }
}

Sprite.prototype.render = function (ctx, x, y, w, h, row, column) {
  ctx.drawImage(this._image, column * this._columnWidth, row * this._rowHeight,
    this._columnWidth, this._rowHeight, x, y, w, h)
}

Sprite.prototype.getId = function () {
  return this._id
}

Sprite.prototype.getSrc = function () {
  return this._src
}

Sprite.prototype.getRows = function () {
  return this._rows
}

Sprite.prototype.getColumns = function () {
  return this._columns
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

/* FACTORY*/
function Registry () {
  this._map = {}
}

Registry.prototype.register = function (sprite) {
  this._map[sprite.getId()] = sprite
}

Registry.prototype.get = function (id) {
  return (this._map[id] || null)
}

exports.Registry = new Registry()
