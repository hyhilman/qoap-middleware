(function () {
  let helper = require('../helper/spec_helper.js')
  let expect = require('chai').expect
  // let async = require('async')
  let coap = require('coap')

  describe('Coap gateway', function () {
    let models = null
    before((done) => {
      helper.qoapStart((function () {
        // models = helper.app.models
        done()
      })())
    })
    // beforeEach((done) => helper.setup(done))
    // afterEach((done) => helper.tearDown(done))

    it('should load', function (done) {
      expect('foobar').to.not.be.undefined
      done()
    })

    // describe('#handlerOther()', function () {
    //   it('should handle other request apart from get and post', (done) => {
    //     let req = coap.request({host: '127.0.0.1', port: 6887, pathname: '/r/bar', method: 'delete'})
    //     req.on('response', function (res) {
    //       expect('4.05').to.eql(res.code)
    //       return done()
    //     })
    //     req.end()
    //   })
    // })
  })
}).call(this)
