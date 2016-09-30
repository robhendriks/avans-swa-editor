const util = require('util')
const Box = require('../math/box').Box
const Vector = require('../math/vector').Vector
const WorldItem = require('./world-item').WorldItem

function WorldLayer (world) {
  WorldItem.call(this, 0, 0, world.getWidth(), world.getHeight())
  this._world = world
  this._items = []
}

WorldLayer.prototype.indexOfItem = function (ofItem) {
  if (ofItem === null) { return -1 }
  for (let i = 0, il = this._items.length; i < il; i++) {
    if (ofItem.equals(this._items[i])) {
      return i
    }
  }
  return -1
}

WorldLayer.prototype.getItems = function () {
  return this._items
}

WorldLayer.prototype.getItemAt = function (point) {

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

WorldLayer.prototype.boxContains = function (box) {
  let result = []
  for (let item of this._items) {
    if (box.containsBox(item)) {
      result.push(item)
    }
  }
  return result
}

WorldLayer.prototype.boxIntersects = function (box) {
  let result = []
  for (let item of this._items) {
    if (box.intersectsBox(item)) {
      result.push(item)
    }
  }
  return result
}

WorldLayer.prototype.setItem = function (item) {
  if (this.containsBox(item) &&
      this.boxIntersects(item).length === 0) {
    this._items.push(item)
    return true
  }
  return false
}

WorldLayer.prototype.unsetItemAt = function (x, y) {
  if (y !== undefined) {
    x = new Vector(x, y)
  }
  return this.unsetItem(this.getItemAt(x))
}

WorldLayer.prototype.unsetItem = function (item) {
  if (item === null) { return false }
  let index = this.indexOfItem(item)
  if (index !== -1) {
    this._items.splice(index, 1)
    return true
  }
  return false
}

util.inherits(WorldLayer, WorldItem)

exports.WorldLayer = WorldLayer
