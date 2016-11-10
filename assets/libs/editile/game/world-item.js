const Box = require('../math/box').Box
const Vector = require('../math/vector').Vector

class WorldItem extends Box {
  constructor (x, y, width, height) {
    super(new Vector(x, y), new Vector(x + (width - 1), y + (height - 1)))
    this._selected = false
  }

  select () {
    this._selected = true
  }

  deselect () {
    this._selected = false
  }

  get selected () {
    return this._selected
  }

  set selected (value) {
    this._selected = (value === true)
  }
}

exports.WorldItem = WorldItem
