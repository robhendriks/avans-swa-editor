const util = require('util')
const EventEmitter = require('events').EventEmitter

function Layer () {
  EventEmitter.call(this)
  this._visible = true
}

Layer.prototype.id = undefined
Layer.prototype.label = undefined
Layer.prototype.zIndex = undefined

Layer.prototype.render = function () {
  throw new Error('Layer::render not yet implemented')
}

Layer.prototype.getVisible = function () {
  return this._visible
}

Layer.prototype.setVisible = function (newValue) {
  this._visible = newValue
  this.emit('update')
}

util.inherits(Layer, EventEmitter)

exports.Layer = Layer
