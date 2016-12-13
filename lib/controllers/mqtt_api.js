(function () {
  module.exports = (app) => {
    const Data = app.models.Data
    const logger = app.helpers.winston

    return function (client) {
      let self = this
      if (!self.clients) self.clients = {}

      client.on('connect', (packet) => {
        self.clients[packet.clientId] = client
        client.id = packet.clientId
        client.subscriptions = []
        client.connack({returnCode: 0})
        logger.mqtt('Client %s has connected', client.id)
      })

      client.on('publish', (packet) => {
        logger.mqtt('Client %s publish a message to %s', client.id, packet.topic)
        return Data.findOrCreate(packet.topic, packet.payload)
      })

      client.on('pingreq', (packet) => {
        logger.mqtt(' Ping from %s', client.id)
        client.pingresp()
      })

      client.on('disconnect', () => {
        logger.mqtt('Client %s has disconnected', client.id)
        client.stream.end()
      })

      client.on('error', (error) => {
        logger.error('Client %s got an error : %s', client.id, error)
        client.stream.end()
      })

      client.on('close', (err) => {
        if (err) logger.error(err)
        logger.mqtt('Client %s has closed connection', client.id)
        delete self.clients[client.id]
      })
    }
  }
}).call(this)
