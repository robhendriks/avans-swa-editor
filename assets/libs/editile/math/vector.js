function Vector(x, y) {
  this.x = x || 0
  this.y = y || 0
}

Vector.prototype.set = function (x, y) {
  this.x = x
  this.y = y
  return this
}

Vector.prototype.setScalar = function (scalar) {
  this.x = scalar
  this.y = scalar
  return this
}

Vector.prototype.setX = function (x) {
  this.x = x
  return this
}

Vector.prototype.setY = function (y) {
  this.y = y
  return this
}

Vector.prototype.clone = function () {
  return new this.constructor(this.x, this.y)
}

Vector.prototype.copy = function (v) {
  this.x = v.x
  this.y = v.y
  return this
}

Vector.prototype.equals = function (v) {
  return ((v.x === this.x) && (v.y === this.y))
}

Vector.prototype.add = function (v) {
  this.x += v.x
  this.y += v.y
  return this
}

Vector.prototype.addScalar = function (scalar) {
  this.x += scalar
  this.y += scalar
  return this
}

Vector.prototype.addVectors = function (a, b) {
  this.x = a.x + b.x
  this.y = a.y + b.y
  return this
}

Vector.prototype.sub = function (v) {
  this.x -= v.x
  this.y -= v.y
  return this
}

Vector.prototype.subScalar = function (v) {
  this.x -= scalar
  this.y -= scalar
  return this
}

Vector.prototype.subVectors = function (a, b) {
  this.x = a.x - b.x
  this.y = a.y - b.y
  return this
}

Vector.prototype.multiply = function (v) {
  this.x *= v.x
  this.y *= v.y
  return this
}

Vector.prototype.multiplyScalar = function (scalar) {
  if (isFinite(scalar)) {
    this.x *= scalar
    this.y *= scalar
  } else {
    this.x = 0
    this.y = 0
  }
  return this
}

Vector.prototype.divide = function (v) {
  this.x /= v.x
  this.y /= v.y
  return this
}

Vector.prototype.divideScalar = function (scalar) {
  return this.multiplyScalar(1 / scalar)
}

Vector.prototype.min = function (v) {
  this.x = Math.min(this.x, v.x)
  this.y = Math.min(this.y, v.y)
  return this
}

Vector.prototype.max = function (v) {
  this.x = Math.max(this.x, v.x)
  this.y = Math.max(this.y, v.y)
  return this
}

Vector.prototype.clamp = function (min, max) {
  this.x = Math.max(min.x, Math.min(max.x, this.x))
  this.y = Math.max(min.y, Math.min(max.y, this.y))
  return this
}

Vector.prototype.floor = function () {
  this.x = Math.floor(x)
  this.y = Math.floor(y)
  return this
}

Vector.prototype.ceil = function () {
  this.x = Math.ceil(x)
  this.y = Math.ceil(y)
  return this
}

Vector.prototype.round = function () {
  this.x = Math.round(x)
  this.y = Math.round(y)
  return this
}

Vector.prototype.roundToZero = function () {
  this.x = (this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x))
  this.y = (this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y))
  return this
}

Vector.prototype.negate = function () {
  this.x = -this.x
  this.y = -this.y
  return this
}

Vector.prototype.dot = function (v) {
  return this.x * v.x + this.y * v.y
}

Vector.prototype.lengthSquared = function () {
  return this.x * this.x + this.y * this.y
}

Vector.prototype.length = function () {
  return Math.sqrt(this.x * this.x + this.y * this.y)
}

Vector.prototype.distanceTo = function (v) {
  return Math.sqrt(this.distanceToSquared(v))
}

Vector.prototype.distanceToSquared = function (v) {
  let dx = this.x - v.x, dy = this.y - v.y
  return dx * dx + dy * dy
}

exports.Vector = Vector
