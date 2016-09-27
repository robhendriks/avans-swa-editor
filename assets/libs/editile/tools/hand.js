const util = require('util')
const Tool = require('./tool').Tool

function Hand () {
  Tool.call(this)
}

Hand.prototype.id = 'hand'
Hand.prototype.label = 'Hand'

Hand.prototype.activate = function (editor) {
  let canvas = editor.getCanvas()
  canvas.style.cursor = 'pointer'
}

Hand.prototype.deactivate = function (editor) {
  console.log('>deactivate<')
}

Hand.prototype.mouseDown = function () {
  console.log('>hand down<')
}

Hand.prototype.mouseUp = function () {
  console.log('>hand up<')
}

util.inherits(Hand, Tool)

exports.Hand = Hand
