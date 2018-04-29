(function() {
  var CoapClient;

  var coap = require('coap');

  CoapClient = (function() {
    function CoapClient(port, host) {
      this.port = port;
      this.host = host;
    }

    CoapClient.prototype.subscribe = function(topic) {
      throw new Error("Not implemented yet");
    };

    CoapClient.prototype.publish = function(topic, message, callback) {
      var req = coap.request({host: this.host, port: this.port, pathname: '/r/' + topic, method: 'post'});
      req.write(message);
      req.end();
      return callback();
    };

    CoapClient.prototype.getLastMessageFromTopic = function(topic, callback) {
      var req  = coap.request('coap://localhost:' + this.port + '/r/' + topic)
      req.on('response', function(res) {
        res = JSON.parse(res.payload.toString())
        callback(res.payload)
      })
      req.end()
    };

    CoapClient.prototype.headers = function() {
      return {};
    };

    CoapClient.prototype.disconnect = function() {};

    CoapClient.prototype.url = function(topic) {
      return "coap://" + this.host + ":" + this.port + "/r/" + topic;
    };

    return CoapClient;

  })();

  CoapClient.build = function(opts, callback) {
    return callback(new CoapClient(opts.coap, '127.0.0.1'));
  };

  module.exports.CoapClient = CoapClient;

}).call(this);
