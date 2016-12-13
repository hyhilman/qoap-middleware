(function () {
  let helper = require('../helper/spec_helper.js')
  let expect = require('chai').expect
  let async = require('async')
  let coap = require('coap')

  describe('Coap gateway', function () {
    let models = null

    before(() => {
      helper.qoapStart()
      helper.globalSetup()
      models = helper.app.models
      return models
    })

    beforeEach((done) => helper.setup(done))

    afterEach((done) => helper.tearDown(done))

    describe('#handlerPost()', function () {
      it('should handle error if url for post request is invalid', (done) => {
        let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/t/foo', method: 'post'})
        req.write('[43, 32]')
        req.on('response', function (res) {
          expect('4.05').to.eql(res.code)
          return done()
        })
        req.end()
      })

      it('should read topic from url for post request', (done) => {
        async.series([
          function (callback) {
            let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/r/foo', method: 'post'})
            req.write('[43, 32]')
            req.on('response', function (res) {
              return callback(null)
            })
            req.end()
          },
          function (callback) {
            let subject = new models.Data('foo')
            return models.Data.find(subject.key, function (err, data) {
              if (err) console.log(err)
              expect(data.key).to.eql(subject.key)
              return callback(null)
            })
          }
        ], function (err, result) {
          if (err) console.log(err)
          return done()
        })
      })

      it('should handle post request by saving a new data', (done) => {
        async.series([
          function (callback) {
            let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/r/foo', method: 'post'})
            req.write('[43, 32]')
            req.on('response', function (res) {
              return callback(null)
            })
            req.end()
          },
          function (callback) {
            let subject = new models.Data('foo')
            return models.Data.find(subject.key, function (err, data) {
              if (err) console.log(err)
              expect(data).to.exist
              return callback(null)
            })
          }
        ], function (err, result) {
          if (err) console.log(err)
          return done()
        })
      })

      it('should handle put request by saving a new data', (done) => {
        async.series([
          function (callback) {
            let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/r/foo', method: 'put'})
            req.write('[43, 32]')
            req.on('response', function (res) {
              return callback(null)
            })
            req.end()
          },
          function (callback) {
            let subject = new models.Data('foo')
            return models.Data.find(subject.key, function (err, data) {
              if (err) console.log(err)
              expect(data).to.exist
              return callback(null)
            })
          }
        ], function (err, result) {
          if (err) console.log(err)
          return done()
        })
      })

      it('should send 2.01 code by the end of post request', (done) => {
        let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/r/foo', method: 'post'})
        req.write('[43, 32]')
        req.on('response', function (res) {
          expect('2.01').to.eql(res.code)
          return done()
        })
        req.end()
      })

      it('should handle post request by overriding existing data', (done) => {
        async.series([
          function (callback) {
            let subject = new models.Data('foo', 'bar')
            subject.save()
            return callback(null)
          },
          function (callback) {
            let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/r/foo', method: 'post'})
            req.write('[43, 32]')
            req.on('response', function (res) {
              return callback(null)
            })
            req.end()
          },
          function (callback) {
            let subject = new models.Data('foo')
            return models.Data.find(subject.key, function (err, data) {
              if (err) console.log(err)
              let value = JSON.parse(data.jsonValue).data
              expect(new Buffer(value).toString()).to.eql('[43, 32]')
              return callback(null)
            })
          }
        ], function (err, result) {
          if (err) console.log(err)
          return done()
        })
      })
    })

    describe('#handlerGet()', function () {
      it('should handle error if url for get request is invalid', (done) => {
        let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/t/foo'})
        req.on('response', function (res) {
          expect('4.04').to.eql(res.code)
          return done()
        })
        req.end()
      })

      it('should read topic from url for get request', (done) => {
        async.series([
          function (callback) {
            let subject = new models.Data('foo', 'bar')
            subject.save()
            return callback(null)
          },
          function (callback) {
            let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/r/foo'})
            req.on('response', function (res) {
              let value = JSON.parse(res.payload.toString()).payload
              expect('bar').to.eql(value)
              return callback()
            })
            req.end()
          }
        ], function (err, result) {
          if (err) console.log(err)
          return done()
        })
      })

      it('should handle get request by sending latest data', (done) => {
        async.series([
          function (callback) {
            let subject = new models.Data('foo', 'bar')
            subject.save()
            return callback(null)
          },
          function (callback) {
            let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/r/foo'})
            req.on('response', function (res) {
              let value = JSON.parse(res.payload.toString()).payload
              expect('bar').to.eql(value)
              return callback()
            })
            req.end()
          }
        ], function (err, result) {
          if (err) console.log(err)
          return done()
        })
      })

      it('should send 2.05 code by the end of get request', (done) => {
        async.series([
          function (callback) {
            let subject = new models.Data('foo', 'bar')
            subject.save()
            return callback(null)
          },
          function (callback) {
            let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/r/foo'})
            req.on('response', function (res) {
              expect('2.05').to.eql(res.code)
              return callback()
            })
            req.end()
          }
        ], function (err, result) {
          if (err) console.log(err)
          return done()
        })
      })

      it('should handle error if data not found', (done) => {
        let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/r/bar'})
        req.on('response', function (res) {
          expect('4.04').to.eql(res.code)
          return done()
        })
        req.end()
      })
    })

    describe('#handlerObserver', function () {
      it('should handle obeserve request', (done) => {
        async.series([
          function (callback) {
            let subject = new models.Data('foo', 'bar')
            subject.save()
            return callback(null)
          },
          function (callback) {
            let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/r/foo', observe: true})
            req.on('response', function (res) {
              expect('2.05').to.eql(res.code)
              return callback()
            })
            req.end()
          }
        ], function (err, result) {
          if (err) console.log(err)
          return done()
        })
      })
    })

    describe('#handlerOther()', function () {
      it('should handle other request apart from get and post', (done) => {
        let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/r/bar', method: 'delete'})
        req.on('response', function (res) {
          expect('4.05').to.eql(res.code)
          return done()
        })
        req.end()
      })
    })
  })
}).call(this)
