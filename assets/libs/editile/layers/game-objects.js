const util = require('util')
const Layer = require('./layer').Layer
const Tile = require('../game/tile').Tile
const Registry = require('../game/sprite').Registry

function GameObjects () {
  Layer.call(this)
}

GameObjects.prototype.id = 'game-objects'
GameObjects.prototype.label = 'Game Objects'
GameObjects.prototype.zIndex = 3
// GameObjects.prototype.ghost = true

GameObjects.prototype.init = function (editor) {
}

GameObjects.prototype.render = function (ctx, rect, editor) {
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

util.inherits(GameObjects, Layer)

exports.GameObjects = GameObjects
