const Layer = require('./layer').Layer
const Tile = require('../game/tile').Tile
const Registry = require('../game/sprite').Registry

class Tiles extends Layer {
  constructor () {
    super('tiles', 'Tiles', 2)
  }

  init (editor) {
  }

  render (ctx, rect, editor) {
    let world
    if ((world = editor.getWorld()) === null) {
      return
    }

    ctx.strokeStyle = 'white'
    ctx.lineWidth = 1

    let tiles = world.getTiles()
    let sprite = Registry.get('a')

    for (let i = 0, il = tiles.length; i < il; i++) {
      let tile = tiles[i]

      let x = Tile.WIDTH * tile.x
      let y = Tile.HEIGHT * tile.y

      let row = Math.floor(tile.type / sprite.getColumns())
      let column = (tile.type % sprite.getColumns())

      sprite.render(ctx, x, y, Tile.WIDTH, Tile.HEIGHT, row, column)

      if (!tile.selected) {
        continue
      }

      ctx.beginPath()
      ctx.rect(x, y, Tile.WIDTH, Tile.HEIGHT)
      ctx.closePath()
      ctx.stroke()
    }
  }
}

exports.Tiles = Tiles
