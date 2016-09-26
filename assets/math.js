const math = module.exports = {}

math.clamp = function (n, min, max) {
  return Math.min(Math.max(n, min), max)
}
