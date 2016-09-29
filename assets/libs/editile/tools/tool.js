function Tool () {
}

Tool.prototype.id = undefined
Tool.prototype.label = undefined
Tool.prototype.cursor = ['default.png', 4, 1]
Tool.prototype.supportedModes = []

/* NON-REQUIRED */
Tool.prototype.activate = function (editor) {
}

/* NON-REQUIRED */
Tool.prototype.deactivate = function (editor) {
}

Tool.prototype.mouseDown = function (evt, editor) {
  throw new Error('Tool::mouseDown not yet implemented')
}

Tool.prototype.mouseUp = function (evt, editor) {
  throw new Error('Tool::mouseUp not yet implemented')
}

Tool.prototype.mouseMove = function (evt, editor) {
  throw new Error('Tool::mouseMove not yet implemented')
}

/* NON-REQUIRED */
Tool.prototype.render = function (evt, editor) {
}

Tool.prototype.isModeSupported = function (mode) {
  return (this.supportedModes.indexOf(mode) !== -1)
}

exports.Tool = Tool
