class Tool {
  constructor (id, label, supportedModes, cursor) {
    this._id = id
    this._label = label
    this._supportedModes = supportedModes || []
    this._cursor = cursor || ['default', 4, 1]
  }

  activate (editor) {
  }

  deactivate (editor) {
  }

  mouseDown (event, editor) {
  }

  mouseUp (event, editor) {
  }

  mouseMove (event, editor) {
  }

  render (context) {
  }

  isModeSupported (mode) {
    return (this.supportedModes.indexOf(mode) !== -1)
  }

  get id () {
    return this._id
  }

  get label () {
    return this._label
  }

  get supportedModes () {
    return this._supportedModes
  }

  get cursor () {
    return this._cursor
  }
}

exports.Tool = Tool
