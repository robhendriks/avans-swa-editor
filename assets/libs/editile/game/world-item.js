const util = require('util')
const Box = require('../math/box').Box
const Vector = require('../math/vector').Vector

function WorldItem(x, y, width, height) {
  Box.call(this,
    new Vector(x, y),
    new Vector(x + (width - 1), y + (height - 1)))
}

util.inherits(WorldItem, Box)

exports.WorldItem = WorldItem
