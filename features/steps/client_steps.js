(function () {
  var expect

  expect = require('chai').expect

  module.exports = function () {
    this.Given(/^client "([^"]*)" subscribe to "([^"]*)" via ([^ ]*)$/, {timeout: 10 * 1000}, function (client, topic, protocol, callback) {
      return this.getClient(protocol, client, function (client) {
        client.subscribe(topic)
        return callback()
      })
    })

    this.When(/^client "([^"]*)" publishes "([^"]*)" to "([^"]*)" via ([^ ]*) with QoS ([^ ]*)$/, {timeout: 10 * 1000}, function (client, message, topic, protocol, qos, callback) {
      return this.getClient(protocol, client, function (client) {
        return client.publish(topic, message, qos, callback)
      })
    })

    return this.Then(/^client "([^"]*)" should have received "([^"]*)" from "([^"]*)" via ([^ ]*)$/, {timeout: 10 * 1000}, function (client, message, topic, protocol, callback) {
      return this.getClient(protocol, client, function (client) {
        return client.getLastMessageFromTopic(topic, function (lastMessage) {
          expect(lastMessage.replace(/\0[\s\S]*$/g, '')).to.equal(message)
          return callback()
        })
      })
    })
  }
}).call(this)
