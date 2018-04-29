(function () {
  let env = require('../../server.js')
  let async = require('async')

  let config = {
    host: '127.0.0.1',
    port: 6379,
    db: 0
  }

  module.exports.qoapStart = function () {
    let env = require('../../server.js')
    let opts = {
      port: 6887,
      coap: 6887,
      mqtt: 6889,
      redisHost: '127.0.0.1',
      redisPort: 6379,
      redisDB: 0
    }
    return env.start(opts)
  }

  module.exports.globalSetup = function () {
    if (this.app != null) {
      return
    }
    this.app = env.app
    env.setup(config)
    return env.configure()
  }

  module.exports.globalTearDown = function () {
    return this.app.redis.client.end(true)
  }

  module.exports.setup = function (done) {
    env.setupAscoltatore(config)
    return async.parallel([
      (function (_this) {
        return function (cb) {
          return _this.app.ascoltatore.once('ready', cb)
        }
      })(this), (function (_this) {
        return function (cb) {
          return _this.app.redis.client.flushdb(cb)
        }
      })(this)
    ], done)
  }

  module.exports.tearDown = function (done) {
    return this.app.ascoltatore.close(done)
  }

  module.exports.connected = function () {
    return this.app.redis.client.connected
  }
}).call(this)
