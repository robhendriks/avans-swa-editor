class Sprite {
  constructor (id, src, rows, columns) {
    this._id = id
    this._src = src
    this._rows = rows || -1
    this._columns = columns || -1
    this._image = null
    this._width = 0
    this._columnWidth = 0
    this._height = 0
    this._rowHeight = 0
  }

  load (callback) {
    this._image = new Image()
    this._image.src = this._src

    let self = this
    this._image.onload = function () {
      let w = self._width = this.width
      let h = self._height = this.height

      if (self._rows < 0 && self._columns < 0) {
        if (self._height % self._width !== 0) {
          throw new Error('invalid sprite dimensions:', self._id)
        }
        self._columns = 1
        self._rows = self._height / self._width
      }

      self._columnWidth = w / self._columns
      self._rowHeight = h / self._rows

      callback()
    }
  }

  render (ctx, x, y, w, h, row, column) {
    ctx.drawImage(this._image, column * this._columnWidth, row * this._rowHeight,
      this._columnWidth, this._rowHeight, x, y, w, h)
  }

  getId () {
    return this._id
  }

  getSrc () {
    return this._src
  }

  getRows () {
    return this._rows
  }

  getColumns () {
    return this._columns
  }

  getImage () {
    return this._image
  }

  getWidth () {
    return this._width
  }

  getHeight () {
    return this._height
  }
}

exports.Sprite = Sprite

/* FACTORY */
class Registry {
  constructor () {
    this._map = {}
  }

  register (sprite) {
    this._map[sprite.getId()] = sprite
  }

  get (id) {
    return (this._map[id] || null)
  }
}

exports.Registry = new Registry()
