(function() {
  var SocketClient;

  SocketClient = (function() {
    function SocketClient(sclient) {
      this.socket = sclient;
    }

    SocketClient.prototype.subscribe = function(topic) {
      return this.socket.emit('subscribe', topic);
    };

    SocketClient.prototype.publish = function(topic, message, callback) {
      return callback();
    };

    SocketClient.prototype.getLastMessageFromTopic = function(topic, callback) {
      this.socket.on("/r/" + topic, function (data) {
        callback(data);
      });
      this.socket.emit('subscribe', topic);
    };

    SocketClient.prototype.headers = function() {
      return {};
    };

    SocketClient.prototype.disconnect = function() {
      this.socket.disconnect();
    };

    SocketClient.prototype.url = function(topic) {
      
    };

    return SocketClient;

  })();

  SocketClient.build = function(opts, callback) {
    var io = require('socket.io-client')
    var socket = io.connect('http://127.0.0.1:' + opts.port, {reconnect: true});
    socket.on('connect', function(){
      return callback(new SocketClient(socket));
    });   
  };

  module.exports.SocketClient = SocketClient;

}).call(this);
