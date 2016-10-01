(function () {
  let app, env, opts, protocols
  let CoapClient, MqttClient, SocketClient

  env = require('../../server.js')
  opts = {
    port: 8000,
    coap: 9777,
    mqtt: 9778,
    redisHost: '127.0.0.1',
    redisPort: 6379,
    redisDB: 0
  }

  app = env.start(opts)

  MqttClient = require('./clients/mqtt').MqttClient
  CoapClient = require('./clients/coap').CoapClient
  SocketClient = require('./clients/websocket').SocketClient

  protocols = {
    COAP: CoapClient,
    MQTT: MqttClient,
    WEBSOCKET: SocketClient
  }

  exports.World = function () {
    this.opts = opts
    this.app = app
    this.clients = {}
    this.getClient = (function (_this) {
      return function (protocol, name, callback) {
        if (_this.clients[name] != null) {
          return callback(_this.clients[name])
        } else {
          return protocols[protocol].build(_this.opts, function (client) {
            _this.clients[name] = client
            return callback(client)
          })
        }
      }
    })(this)
  }
}).call(this)
