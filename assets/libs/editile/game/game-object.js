const util = require('util')
const WorldItem = require('./world-item').WorldItem
const Registry = require('./sprite').Registry

function GameObject (x, y, width, height, sprite) {
  WorldItem.call(this, x, y, width, height)
  this._sprite = sprite
  this._rotIndex = 0
  this._rotLimit = sprite.getRows()
}

GameObject.prototype.rotateLeft = function () {
  this._rotIndex--
  if (this._rotIndex < 0) {
    this._rotIndex = this._rotLimit - 1
  }
}

GameObject.prototype.rotateRight = function () {
  this._rotIndex++
  if (this._rotIndex >= this._rotLimit) {
    this._rotIndex = 0
  }
}

GameObject.prototype.getSprite = function () {
  return this._sprite
}

Object.defineProperty(GameObject.prototype, 'rotation', {
  get: function () {
    return this._rotIndex
  }
})

util.inherits(GameObject, WorldItem)

exports.GameObject = GameObject

/* FACTORY*/
function Factory () {
  this._map = {}
}

Factory.prototype.addObject = function (obj) {
  this._map[obj.id] = obj
}

Factory.prototype.getObject = function (id) {
  return (id in this._map ? this._map[id] : null)
}

Factory.prototype.createObject = function (id, x, y) {
  let obj
  if ((obj = this.getObject(id)) !== null) {
    let sprite
    if ((sprite = Registry.get(obj.spriteId)) === null) {
      console.warn('invalid sprite ID:', obj.spriteId)
      return null
    }
    return new GameObject(x, y, obj.size.x, obj.size.y, sprite)
  }
  console.warn('invalid game object ID:', id)
  return null
}

exports.Factory = new Factory()
