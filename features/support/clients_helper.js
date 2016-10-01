(function () {
  module.exports = function () {
    return this.After(function (done) {
      var client, name, ref
      ref = this.clients
      for (name in ref) {
        client = ref[name]
        client.disconnect()
      }

      return function () {
        return done()
      }
    })
  }
}).call(this)
