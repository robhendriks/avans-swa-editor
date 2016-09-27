const util = require('util')
const EventEmitter = require('events').EventEmitter

function Layer () {
  EventEmitter.call(this)
  this._visible = true
  this._relative = true
  this._scalable = true
}

Layer.prototype.id = undefined
Layer.prototype.label = undefined
Layer.prototype.zIndex = undefined

Layer.prototype.init = function (editor) {
  throw new Error('Layer::init not yet implemented')
}

Layer.prototype.render = function (ctx, rect, editor) {
  throw new Error('Layer::render not yet implemented')
}

Layer.prototype.isVisible = function () {
  return this._visible
}

Layer.prototype.setVisible = function (newValue) {
  this._visible = newValue
  this.emit('visibility changed')
}

Layer.prototype.isRelative = function () {
  return this._relative
}

Layer.prototype.setRelative = function (newValue) {
  this._relative = newValue
}

Layer.prototype.isScalable = function () {
  return this._scalable
}

Layer.prototype.setScalable = function (newValue) {
  this._scalable = newValue
}

util.inherits(Layer, EventEmitter)

exports.Layer = Layer
