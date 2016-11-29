const {World} = require('./world');

class App {
  constructor (opts) {
    this._opts = opts || {};
    this._world = null;
  }

  init () {
  }

  get world () {
    return this._world;
  }
}

exports.App = App;
