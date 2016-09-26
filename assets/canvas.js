const World = require('./world')
const Tile = require('./tile')

const sources = {
  tiles: 'assets/images/tiles.png'
}

let images = {}
let canvas = null
let context = null
let ratio = 1
let zoom = 1
let width = 0
let height = 0
let world = null
let tileSprite = null

function init () {
  canvas = document.getElementById('canvas')
  context = canvas.getContext('2d')

  world = new World(10, 10)

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      world.addTile(new Tile(i, j, Math.floor(Math.random() * 4) + 1))
    }
  }

  tileSprite = images['tiles']

  window.addEventListener('resize', resize)
  resize()
}

function resize (evt) {
  let parent = canvas.parentNode
  width = parent.clientWidth
  height = parent.clientHeight

  let devicePixelRatio = window.devicePixelRatio || 1
  let backingStoreRatio = context.backingStorePixelRatio || 1
  ratio = devicePixelRatio / backingStoreRatio

  canvas.width = width * ratio
  canvas.height = height * ratio

  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  redraw()
}

function redraw () {
  context.save()
  context.scale(ratio + (zoom - 1), ratio + (zoom - 1))

  if (world !== null) {
    drawGrid()
    drawWorld()
    drawAxes()
  }

  context.restore()
}

function drawGrid () {
  // this.x = ((int)((getSize().width / 2.0F - this.layout.width * this.SCALE / 2.0F) / this.SCALE));
  // this.y = ((int)((getSize().height / 2.0F - this.layout.height * this.SCALE / 2.0F) / this.SCALE));

  let x = (width / 2 - world.actualWidth * zoom / 2) / zoom
  let y = (height / 2 - world.actualHeight * zoom / 2) / zoom

  context.save()
  context.translate(x, y)

  context.lineWidth = 1
  context.strokeStyle = '#404040'

  // Grid x
  for (let i = 0; i <= world.width; i++) {
    if (i === world.width / 2) { continue }
    context.beginPath()
    context.moveTo(i * world.tileWidth, 0)
    context.lineTo(i * world.tileHeight, world.actualHeight)
    context.stroke()
  }

  // Grid y
  for (let i = 0; i <= world.height; i++) {
    if (i === world.height / 2) { continue }
    context.beginPath()
    context.moveTo(0, i * world.tileHeight)
    context.lineTo(world.actualWidth, i * world.tileHeight)
    context.stroke()
  }
}

function drawWorld () {
  context.fillStyle = '#f4f4f4'

  for (let i = 0; i < world.tiles.length; i++) {
    let tile = world.tiles[i]
    if (tile.type === -1) { continue }

    context.save()
    context.translate(tile.x * world.tileWidth, tile.y * world.tileHeight)

    let x = tile.type % 4
    let y = Math.floor(tile.type / 4)
    let sx = x * 64
    let sy = y * 64

    context.drawImage(tileSprite, sx, sy, 64, 64, 0, 0, world.tileWidth, world.tileHeight)
    context.restore()
  }
}

function drawAxes () {
  // X-axis
  context.strokeStyle = '#DC0000'

  context.beginPath()
  context.moveTo(0, world.actualHeight / 2)
  context.lineTo(world.actualWidth, world.actualHeight / 2)
  context.stroke()

  // Y-axis
  context.strokeStyle = '#00DC00'

  context.beginPath()
  context.moveTo(world.actualWidth / 2, 0)
  context.lineTo(world.actualWidth / 2, world.actualHeight)
  context.stroke()
}

function load (callback) {
  let size = 0
  for (let src in sources) {
    size++
  }

  let loaded = 0
  for (let src in sources) {
    console.log('Loading resource \'%s\'...', sources[src])
    images[src] = new Image()
    images[src].onload = function () {
      if (++loaded >= size) {
        callback()
      }
    }
    images[src].src = sources[src]
  }
}

load(init)
