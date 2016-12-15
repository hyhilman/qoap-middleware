(function () {
  module.exports = (app) => {
    const logger = app.helpers.winston
    const Data = app.models.Data

    app.get(/^\/r\/(.+)$/, (req, res) => {
      var topic
      topic = req.params[0]

      logger.http(' Incoming %s request from %s for %s ', req.method, req.ip, topic)
      return Data.find(topic, (err, data) => {
        let type = req.accepts(['txt', 'json'])

        if (err != null || data == null) {
          return res.sendStatus(404)
        } else if (type === 'json') {
          res.contentType('json')
          try {
            let stringValue = (data.value.type === 'Buffer')
              ? new Buffer(data.value).toString()
              : data.value
            return res.send(stringValue)
          } catch (error) {
            logger.error('error')
            return res.json('' + data.value)
          }
        } else if (type === 'txt') {
          return res.send(data.value)
        } else {
          return res.sendStatus(406)
        }
      })
    })

    return app.post(/^\/r\/(.+)$/, function (req, res) {
      var payload, topic
      topic = req.params[0]
      if (req.is('json')) {
        payload = req.body
      } else {
        payload = req.body.payload
      }
      Data.findOrCreate(topic, payload)
      logger.http(' Incoming %s request from %s for %s ', req.method, req.ip, topic)
      return res.sendStatus(204)
    })
  }
}).call(this)
