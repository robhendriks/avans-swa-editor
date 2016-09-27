const Vector = require('./vector').Vector

function Box (min, max) {
  this.min = (min || new Vector(+ Infinity, + Infinity))
  this.max = (max || new Vector(- Infinity, - Infinity))
}

Box.prototype.set = function (min, max) {
  this.min.copy(min)
  this.max.copy(max)
  return this
}

Box.prototype.setFromPoints = function (points) {
  this.makeEmpty()
  for (let i = 0, il = points.length; i < il; i++) {
    this.expandByPoint(points[i])
  }
  return this
}

Box.prototype.copy = function (box) {
  this.min.copy(box.min)
  this.max.copy(box.max)
  return this
}

Box.prototype.clone = function () {
  return new this.constructor().copy(this)
}

Box.prototype.makeEmpty = function () {
  this.min.x = this.min.y = + Infinity
  this.max.x = this.max.y = - Infinity
}

Box.prototype.isEmpty = function () {
  return (this.max.x < this.min.x) || (this.max.y < this.min.y)
}

Box.prototype.getCenter = function (optionalTarget) {
  let result = optionalTarget || new Vector()
  return this.isEmpty() ? result.set(0, 0) : result.addVectors(this.min, this.max).multiplyScalar(0.5)
}

Box.prototype.getSize = function (optionalTarget) {
  let result = optionalTarget || new Vector()
  return this.isEmpty() ? result.set(0, 0) : result.subVectors(this.max, this.min)
}

Box.prototype.expandByPoint = function (point) {
  this.min.min(point)
  this.max.max(point)
  return this
}

exports.Box = Box
