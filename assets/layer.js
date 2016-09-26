function Layer () {
  this._hidden = false
}

Layer.prototype = {

  constructor: Layer,

  _render: function (ctx, canvas) {
  },

  render: function (ctx, canvas) {
    if (!this._hidden) {
      this._render(ctx, canvas)
    }
  },

  show: function () {
    this._hidden = false
  },

  hide: function () {
    this._hidden = true
  },

  toggle: function () {
    this._hidden = !this._hidden
  },

  get hidden () {
    return this._hidden
  }

}

module.exports = Layer
