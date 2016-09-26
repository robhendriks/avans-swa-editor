const util = require('util')
const Layer = require('./layer').Layer

function Grid () {
  Layer.call(this)
}

Grid.prototype.id = 'grid'
Grid.prototype.label = 'Grid'
Grid.prototype.zIndex = 1

util.inherits(Grid, Layer)

exports.Grid = Grid
