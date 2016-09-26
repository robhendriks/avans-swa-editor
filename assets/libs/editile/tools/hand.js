const util = require('util')
const Tool = require('./tool').Tool

function Hand () {
  Tool.call(this)
}

Hand.prototype.mouseDown = function () {
  console.log('>hand down<')
}

Hand.prototype.mouseUp = function () {
  console.log('>hand up<')
}

util.inherits(Hand, Tool)

exports.Hand = Hand
