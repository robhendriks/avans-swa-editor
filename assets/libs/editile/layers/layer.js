const EventEmitter = require('events').EventEmitter

class Layer extends EventEmitter {
  constructor (id, label, zIndex) {
    super()
    this._id = id
    this._label = label
    this._zIndex = zIndex
    this._visible = true
    this._relative = true
    this._scalable = true
  }

  init (editor) {
    throw new Error('Layer::init not yet implemented')
  }

  render (ctx, rect, editor) {
    throw new Error('Layer::render not yet implemented')
  }

  /* PRE-ES6 */

  isVisible () {
    return this._visible
  }

  setVisible (newValue) {
    this._visible = newValue
    this.emit('visibility changed')
  }

  isRelative () {
    return this._relative
  }

  setRelative (newValue) {
    this._relative = newValue
  }

  isScalable () {
    return this._scalable
  }

  setScalable (newValue) {
    this._scalable = newValue
  }

  get id () {
    return this._id
  }

  get label () {
    return this._label
  }

  get zIndex () {
    return this._zIndex
  }

  get ghost () {
    return this._ghost
  }
}

exports.Layer = Layer
