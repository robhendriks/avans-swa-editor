const Vector = require('../math/vector').Vector
const WorldItem = require('./world-item').WorldItem

class WorldLayer extends WorldItem {
  constructor (world) {
    super(0, 0, world.getWidth(), world.getHeight())
    this._world = world
    this._items = []
  }

  indexOfItem (ofItem) {
    if (ofItem === null) { return -1 }
    for (let i = 0, il = this._items.length; i < il; i++) {
      if (ofItem.equals(this._items[i])) {
        return i
      }
    }
    return -1
  }

  getItems () {
    return this._items
  }

  getItemAt (point) {
    if (!this.containsPoint(point)) {
      return false
    }
    for (let item of this._items) {
      if (item.containsPoint(point)) {
        return item
      }
    }
    return null
  }

  boxContains (box) {
    let result = []
    for (let item of this._items) {
      if (box.containsBox(item)) {
        result.push(item)
      }
    }
    return result
  }

  boxIntersects (box) {
    let result = []
    for (let item of this._items) {
      if (box.intersectsBox(item)) {
        result.push(item)
      }
    }
    return result
  }

  setItem (item) {
    if (this.containsBox(item) &&
        this.boxIntersects(item).length === 0) {
      this._items.push(item)
      return true
    }
    return false
  }

  unsetItemAt (x, y) {
    if (y !== undefined) {
      x = new Vector(x, y)
    }
    return this.unsetItem(this.getItemAt(x))
  }

  unsetItem (item) {
    if (item === null) { return false }
    let index = this.indexOfItem(item)
    if (index !== -1) {
      this._items.splice(index, 1)
      return true
    }
    return false
  }

  selectAll () {
    for (let item of this._items) {
      item.select()
    }
  }

  deselectAll () {
    for (let item of this._items) {
      item.deselect()
    }
  }

  clear () {
    this._items = []
  }
}

exports.WorldLayer = WorldLayer
