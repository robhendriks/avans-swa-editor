class Vector {
  constructor (x, y) {
    this.x = x || 0
    this.y = y || 0
  }

  set (x, y) {
    this.x = x
    this.y = y
    return this
  }

  setScalar (scalar) {
    this.x = scalar
    this.y = scalar
    return this
  }

  setX (x) {
    this.x = x
    return this
  }

  setY (y) {
    this.y = y
    return this
  }

  clone () {
    return new this.constructor(this.x, this.y)
  }

  copy (v) {
    this.x = v.x
    this.y = v.y
    return this
  }

  equals (v) {
    return ((v.x === this.x) && (v.y === this.y))
  }

  add (v) {
    this.x += v.x
    this.y += v.y
    return this
  }

  addScalar (scalar) {
    this.x += scalar
    this.y += scalar
    return this
  }

  addVectors (a, b) {
    this.x = a.x + b.x
    this.y = a.y + b.y
    return this
  }

  sub (v) {
    this.x -= v.x
    this.y -= v.y
    return this
  }

  subScalar (scalar) {
    this.x -= scalar
    this.y -= scalar
    return this
  }

  subVectors (a, b) {
    this.x = a.x - b.x
    this.y = a.y - b.y
    return this
  }

  multiply (v) {
    this.x *= v.x
    this.y *= v.y
    return this
  }

  multiplyScalar (scalar) {
    if (isFinite(scalar)) {
      this.x *= scalar
      this.y *= scalar
    } else {
      this.x = 0
      this.y = 0
    }
    return this
  }

  divide (v) {
    this.x /= v.x
    this.y /= v.y
    return this
  }

  divideScalar (scalar) {
    return this.multiplyScalar(1 / scalar)
  }

  min (v) {
    this.x = Math.min(this.x, v.x)
    this.y = Math.min(this.y, v.y)
    return this
  }

  max (v) {
    this.x = Math.max(this.x, v.x)
    this.y = Math.max(this.y, v.y)
    return this
  }

  clamp (min, max) {
    this.x = Math.max(min.x, Math.min(max.x, this.x))
    this.y = Math.max(min.y, Math.min(max.y, this.y))
    return this
  }

  floor () {
    this.x = Math.floor(this.x)
    this.y = Math.floor(this.y)
    return this
  }

  ceil () {
    this.x = Math.ceil(this.x)
    this.y = Math.ceil(this.y)
    return this
  }

  round () {
    this.x = Math.round(this.x)
    this.y = Math.round(this.y)
    return this
  }

  roundToZero () {
    this.x = (this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x))
    this.y = (this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y))
    return this
  }

  negate () {
    this.x = -this.x
    this.y = -this.y
    return this
  }

  dot (v) {
    return this.x * v.x + this.y * v.y
  }

  lengthSquared () {
    return this.x * this.x + this.y * this.y
  }

  length () {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  distanceTo (v) {
    return Math.sqrt(this.distanceToSquared(v))
  }

  distanceToSquared (v) {
    let dx = this.x - v.x
    let dy = this.y - v.y
    return dx * dx + dy * dy
  }
}

exports.Vector = Vector