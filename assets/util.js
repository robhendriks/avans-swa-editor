var util = module.exports = {}

util.isPowerOfTwo = function (num) {
  return num > 0 && !(num & (num - 1))
}

util.getRatio = function (context) {
  let devicePixelRatio = (window.devicePixelRatio || 1)
  let backingStoreRatio = (context.backingStorePixelRatio || 1)
  return devicePixelRatio / backingStoreRatio
}
