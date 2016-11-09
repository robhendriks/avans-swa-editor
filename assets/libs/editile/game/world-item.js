const Box = require('../math/box').Box
const Vector = require('../math/vector').Vector

class WorldItem extends Box {
  constructor (x, y, width, height) {
    super(new Vector(x, y), new Vector(x + (width - 1), y + (height - 1)))
  }
}

exports.WorldItem = WorldItem
