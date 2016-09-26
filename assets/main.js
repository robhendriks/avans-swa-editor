const editile = require('./libs/editile')
const editor = new editile.Editor()

editor.init({
  tools: [
    new editile.tools.Hand(),
    new editile.tools.Brush()
  ]
})
