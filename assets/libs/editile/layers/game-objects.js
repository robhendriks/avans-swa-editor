const Layer = require('./layer').Layer
const Tile = require('../game/tile').Tile

class GameObjects extends Layer {
  constructor () {
    super('game-objects', 'Game Objects', 3)
  }

  init (editor) {
  }

  render (ctx, rect, editor) {
    let world
    if ((world = editor.getWorld()) === null) {
      return
    }

    let layer = world._objectLayer

    for (let item of layer.getItems()) {
      let x = item.min.x * Tile.WIDTH
      let y = item.min.y * Tile.HEIGHT

      let size = item.getSize()
      let w = (size.x + 1) * Tile.WIDTH
      let h = (size.y + 1) * Tile.HEIGHT

      let sprite = item.getSprite()

      sprite.render(ctx, x, y, w, h, item.rotation, 0)
    }
  }
}

exports.GameObjects = GameObjects
