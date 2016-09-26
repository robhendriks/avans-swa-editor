const util = require('util')
const EventEmitter = require('events').EventEmitter

function Editor () {
  EventEmitter.call(this)
}

Editor.prototype.init = function () {
  console.log('ayy')
}

util.inherits(Editor, EventEmitter)

exports.Editor = Editor
