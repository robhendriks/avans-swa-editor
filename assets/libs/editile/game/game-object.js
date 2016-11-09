const WorldItem = require('./world-item').WorldItem
const Registry = require('./sprite').Registry

class GameObject extends WorldItem {
  constructor (x, y, width, height, sprite) {
    super(x, y, width, height)
    this._sprite = sprite
    this._rotIndex = 0
    this._rotLimit = sprite.getRows()
  }

  rotateLeft () {
    this._rotIndex--
    if (this._rotIndex < 0) {
      this._rotIndex = this._rotLimit - 1
    }
  }

  rotateRight () {
    this._rotIndex++
    if (this._rotIndex >= this._rotLimit) {
      this._rotIndex = 0
    }
  }

  getSprite () {
    return this._sprite
  }

  get rotation () {
    return this._rotIndex
  }
}

exports.GameObject = GameObject

/* FACTORY */
class Factory {
  constructor () {
    this._map = {}
  }

  addObject (obj) {
    this._map[obj.id] = obj
  }

  getObject (id) {
    return (id in this._map ? this._map[id] : null)
  }

  createObject (id, x, y) {
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
}

exports.Factory = new Factory()
