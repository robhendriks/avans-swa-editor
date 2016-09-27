const math = module.exports = {}

math.clamp = function (value, min, max) {
  return Math.min(Math.max(value, min), max)
}
