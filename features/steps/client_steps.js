(function() {
  var expect;

  expect = require('chai').expect;

  module.exports = function() {
    this.Given(/^client "([^"]*)" subscribe to "([^"]*)" via ([^ ]*)$/, {timeout: 10 * 1000}, function(client, topic, protocol, callback) {
      return this.getClient(protocol, client, function(client) {
        client.subscribe(topic);
        return callback();
      });
    });

    this.When(/^client "([^"]*)" publishes "([^"]*)" to "([^"]*)" via ([^ ]*)$/, {timeout: 10 * 1000}, function(client, message, topic, protocol, callback) {
      return this.getClient(protocol, client, function(client) {
        return client.publish(topic, message, callback);
      });
    });

    return this.Then(/^client "([^"]*)" should have received "([^"]*)" from "([^"]*)" via ([^ ]*)$/, {timeout: 10 * 1000}, function(client, message, topic, protocol, callback) {
      return this.getClient(protocol, client, function(client) {
        return client.getLastMessageFromTopic(topic, function(lastMessage) {
          expect(lastMessage).to.equal(message);
          return callback();
        });
      });
    });

  };

}).call(this);
