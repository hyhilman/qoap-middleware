(function () {
  module.exports = function () {
    return this.After(function (done) {
      var base
      if (typeof (base = this.app.models.Data).reset === 'function') {
        base.reset()
      }

      this.app.redis.client.flushdb(function (err, success) {
        if (err) return err
        return function () {
          return done()
        }
      })
    })
  }
}).call(this)
