(function () {
  module.exports = (app) => {
    const Data = app.models.Data
    const logger = app.helpers.winston
	
	//const crypto = require('crypto');
	//const secret = 'middleware';

    return app.io.on('connection', (socket) => {
      logger.socket(' Client %s has connected ', socket.id)

      let subscriptions
      subscriptions = {}
      socket.on('subscribe', (topic) => {
        logger.socket('Client %s subscribe to %s ', socket.id, topic)
        let subscription
        subscription = (currentData) => {
          let stringValue = null
	  //let obj = null
          
	//console.log(currentData.value)
	//var obj = currentData.value
	//currentData.value["hash"]=hash

	  if (currentData.value.type === 'Buffer' || currentData.value instanceof Buffer) {
            stringValue = new Buffer(currentData.value).toString()
          } else {
            stringValue = currentData.value
          }

	//var obj = JSON.parse(stringValue)
	//var obj = stringValue
	//console.log(stringValue)
	//var hash = crypto.createHmac('sha512', secret).update(stringValue).digest('hex');
	//obj["hash"] = hash;
	//stringValue = new Buffer.from(JSON.stringify(obj))
	//console.log(obj)

          return socket.emit('/r/' + topic, stringValue)
	}

        subscriptions[topic] = subscription
        Data.subscribe(topic, subscription)
        return Data.find(topic, (err, data) => {
          if (err) logger.error(err)
          if ((data != null ? data.value : void 0) != null) {
            return subscription(data)
	//console.log('asd', data)
          }
	//console.log(data)
        })
      })
	//console.log(Data)

      return socket.on('disconnect', () => {
        logger.socket(' Client has disconnected ')
        let listener, results, topic
        results = []
        for (topic in subscriptions) {
          listener = subscriptions[topic]
          results.push(Data.unsubscribe(topic, listener))
        }
        return results
      })
    })
  }
}).call(this)
