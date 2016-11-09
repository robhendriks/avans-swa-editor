const Vector = require('./vector').Vector

class Box {
  constructor (min, max) {
    this.min = (min || new Vector(+Infinity, +Infinity))
    this.max = (max || new Vector(-Infinity, -Infinity))
  }

  equals (box) {
    return (this.min.equals(box.min) && this.max.equals(box.max))
  }

  set (min, max) {
    this.min.copy(min)
    this.max.copy(max)
    return this
  }

  setFromPoints (points) {
    this.makeEmpty()
    for (let i = 0, il = points.length; i < il; i++) {
      this.expandByPoint(points[i])
    }
    return this
  }

  copy (box) {
    this.min.copy(box.min)
    this.max.copy(box.max)
    return this
  }

  clone () {
    return new this.constructor().copy(this)
  }

  makeEmpty () {
    this.min.x = this.min.y = +Infinity
    this.max.x = this.max.y = -Infinity
  }

  isEmpty () {
    return (this.max.x < this.min.x) || (this.max.y < this.min.y)
  }

  getCenter (optionalTarget) {
    let result = optionalTarget || new Vector()
    return this.isEmpty() ? result.set(0, 0) : result.addVectors(this.min, this.max).multiplyScalar(0.5)
  }

  getSize (optionalTarget) {
    let result = optionalTarget || new Vector()
    return this.isEmpty() ? result.set(0, 0) : result.subVectors(this.max, this.min)
  }

  expandByPoint (point) {
    this.min.min(point)
    this.max.max(point)
    return this
  }

  containsPoint (point) {
    if (point.x < this.min.x || point.x > this.max.x ||
        point.y < this.min.y || point.y > this.max.y) {
      return false
    }
    return true
  }

  containsBox (box) {
    if ((this.min.x <= box.min.x) && (box.max.x <= this.max.x) &&
        (this.min.y <= box.min.y) && (box.max.y <= this.max.y)) {
      return true
    }
    return false
  }

  intersectsBox (box) {
    if (box.max.x < this.min.x || box.min.x > this.max.x ||
        box.max.y < this.min.y || box.min.y > this.max.y) {
      return false
    }
    return true
  }
}

exports.Box = Box
