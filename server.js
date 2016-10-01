(function () {
  let app, start, mqtt, coap, redis, ascoltatori, logger, argv, consign
  let setupAscoltatore, setup, configure, coapServer

  consign = require('consign')
  redis = require('redis')
  ascoltatori = require('ascoltatori')
  mqtt = require('mqtt')
  coap = require('coap')
  module.exports.app = app = require('http').Server()
  app.io = require('socket.io')(app)
  app.redis = {}

  module.exports.setupAscoltatore = setupAscoltatore = (opts) => {
    if (opts == null) {
      opts = {}
    }
    app.ascoltatore = new ascoltatori.RedisAscoltatore({
      redis: redis,
      port: opts.port,
      host: opts.host,
      db: opts.db
    })
    return app.ascoltatore
  }

  module.exports.setup = setup = (opts) => {
    let args
    if (opts == null) {
      opts = {}
    }
    args = [opts.port, opts.host]
    app.redis.client = redis.createClient.apply(redis, args)
    app.redis.client.select(opts.db || 0)
    return setupAscoltatore(opts)
  }

  module.exports.configure = configure = () => {
    return consign({cwd: 'lib', verbose: false})
      .include('models')
      .include('helpers')
      .include('controllers')
      .into(app)
  }

  start = module.exports.start = (opts, cb) => {
    configure()
    logger = app.helpers.winston
    argv = app.helpers.yargs

    if (opts == null) {
      opts = {}
    }
    if (cb == null) {
      cb = () => {}
    }

    opts.port || (opts.port = argv['port'])
    opts.coap || (opts.coap = argv['coap'])
    opts.mqtt || (opts.mqtt = argv['mqtt'])
    opts.mqttHost || (opts.mqttHost = argv['mqtt-host'])
    opts.redisPort || (opts.redisPort = argv['redis-port'])
    opts.redisHost || (opts.redisHost = argv['redis-host'])
    opts.redisDB || (opts.redisDB = argv['redis-db'])

    setup({
      port: opts.redisPort,
      host: opts.redisHost,
      db: opts.redisDB
    })

    app.listen(opts.port, () => {
      logger.socket('Websocket listening on port %d in %s mode', opts.port, process.env.NODE_ENV, {protocol: 'coap'})
    })

    coapServer = coap.createServer()
    coapServer.on('request', app.controllers.coap_api).listen(opts.coap, () => {
      logger.coap('CoAP server listening on port %d in %s mode', opts.coap, process.env.NODE_ENV)
    })

    new mqtt.Server(app.controllers.mqtt_api).listen(opts.mqtt, opts.mqttHost, () => {
      logger.mqtt('MQTT server listening on port %d in %s mode', opts.mqtt, process.env.NODE_ENV)
    })

    return app
  }

  if (require.main.filename === __filename) {
    start()
  }
}).call(this)
