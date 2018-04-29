(function () {
  let MqttClient, mqtt

  mqtt = require('mqtt')

  MqttClient = (function () {
    function MqttClient (client1) {
      this.client = client1
      this.last_packets = {}
      this.client.on('publish', (function (_this) {
        return function (packet) {
          _this.last_packets[packet.topic] = packet.payload
          return _this.last_packets[packet.topic]
        }
      })(this))
    }

    MqttClient.prototype.subscribe = function (topic) {
      return this.client.subscribe(topic, {qos: 0})
    }

    MqttClient.prototype.publish = function (topic, message, callback) {
      this.client.publish(topic, message)
      return callback()
    }

    MqttClient.prototype.disconnect = function () {
      return this.client.end()
    }

    MqttClient.prototype.getLastMessageFromTopic = function (topic, callback) {
      let lastPackets, listenToMessage
      lastPackets = this.last_packets[topic]
      if (lastPackets != null) {
        callback(lastPackets)
        return
      }

      listenToMessage = (function (_this) {
        return function (topic, message) {
          callback(message.toString())
        }
      })(this)
      return this.client.on('message', listenToMessage)
    }

    return MqttClient
  })()

  MqttClient.build = function (opts, callback) {
    var client = mqtt.connect({port: opts.mqtt, host: '127.0.0.1', keepalive: 10000})
    client.on('connect', function () {
      return callback(new MqttClient(client))
    })
  }

  module.exports.MqttClient = MqttClient
}).call(this)
