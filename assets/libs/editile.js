const editile = exports

editile.Editor = require('./editile/editor').Editor
editile.Tool = require('./editile/tools/tool').Tool
editile.Layer = require('./editile/layers/layer').Layer

editile.Vector = require('./editile/math/vector').Vector
editile.Box = require('./editile/math/box').Box

editile.World = require('./editile/game/world').World
editile.Tile = require('./editile/game/tile').Tile
editile.Sprite = require('./editile/game/sprite').Sprite

editile.tools = require('./editile/tools')
editile.layers = require('./editile/layers')
