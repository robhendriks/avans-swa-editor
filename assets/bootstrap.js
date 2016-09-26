const canvas = require('./canvas')
const World = require('./world')

module.exports = function () {
  canvas.init({
    id: 'canvas',
    world: new World()
  })
}
