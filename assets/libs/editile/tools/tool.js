function Tool () {
}

Tool.prototype.id = undefined
Tool.prototype.label = undefined

Tool.prototype.mouseDown = function () {
  throw new Error('Tool::mouseDown not yet implemented')
}

Tool.prototype.mouseUp = function () {
  throw new Error('Tool::mouseUp not yet implemented')
}

exports.Tool = Tool
