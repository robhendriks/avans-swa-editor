const util = require('util')
const Tool = require('./tool').Tool

function Brush () {
  Tool.call(this)
}

Brush.prototype.id = 'brush'
Brush.prototype.label = 'Brush'

Brush.prototype.activate = function (editor) {
  let canvas = editor.getCanvas()
  canvas.style.cursor = 'crosshair'
}

Brush.prototype.deactivate = function (editor) {
  console.log('>deactivate<')
}

Brush.prototype.mouseDown = function (evt, editor) {
}

Brush.prototype.mouseUp = function (evt, editor) {
}

Brush.prototype.mouseMove = function (evt, editor) {
}

util.inherits(Brush, Tool)

exports.Brush = Brush
