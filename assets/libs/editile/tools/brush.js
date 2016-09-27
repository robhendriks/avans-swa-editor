const util = require('util')
const Tool = require('./tool').Tool

function Brush () {
  Tool.call(this)
}

Brush.prototype.id = 'brush'
Brush.prototype.label = 'Brush'

Brush.prototype.mouseDown = function () {
  console.log('>brush down<')
}

Brush.prototype.mouseUp = function () {
  console.log('>brush up<')
}

util.inherits(Brush, Tool)

exports.Brush = Brush
