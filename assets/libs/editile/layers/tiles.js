const util = require('util')
const Layer = require('./layer').Layer

function Tiles () {
  Layer.call(this)
}

Tiles.prototype.id = 'tiles'
Tiles.prototype.label = 'Tiles'
Tiles.prototype.zIndex = 3

Tiles.prototype.render = function (ctx, rect, editor) {

}

util.inherits(Tiles, Layer)

exports.Tiles = Tiles
