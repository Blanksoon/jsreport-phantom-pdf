var path = require('path')
var Reporter = require('jsreport-core').Reporter

require('should')

describe('phantom pdf', function () {
  var reporter

  beforeEach(function () {
    reporter = new Reporter({
      rootDirectory: path.join(__dirname, '../')
    })

    return reporter.init()
  })

  it('should not fail when rendering', function () {
    var request = {
      template: { content: 'Heyx', recipe: 'phantom-pdf', engine: 'none' }
    }

    return reporter.render(request, {}).then(function (response) {
      response.content.toString().should.containEql('%PDF')
    })
  })

  it('should provide logs', function () {
    var request = {
      template: { content: 'Heyx <script>console.log("hello world")</script>', recipe: 'phantom-pdf', engine: 'none' },
      options: { debug: { logsToResponseHeader: true } }
    }

    return reporter.render(request, {}).then(function (response) {
      response.headers['Debug-Logs'].should.match(/hello world/)
    })
  })

  it('should run in default phantomjs', function () {
    var request = {
      template: { content: 'Hey', recipe: 'phantom-pdf', engine: 'none' },
      options: { debug: { logsToResponseHeader: true } }
    }

    return reporter.render(request, {}).then(function (response) {
      response.headers['Debug-Logs'].should.match(new RegExp(reporter['phantom-pdf'].definition.options.phantoms[0].version))
    })
  })

  it('should be able to choose phantomjs version', function () {
    var request = {
      template: { content: 'Hey', recipe: 'phantom-pdf', engine: 'none', phantom: { phantomjsVersion: '2.1.1' } },
      options: { debug: { logsToResponseHeader: true } }
    }

    return reporter.render(request, {}).then(function (response) {
      response.headers['Debug-Logs'].should.match(/2.1.1/)
    })
  })
})

describe('phantom pdf with defaultPhantomjsVersion', function () {
  var reporter

  beforeEach(function () {
    reporter = new Reporter({
      rootDirectory: path.join(__dirname, '../'),
      phantom: {
        defaultPhantomjsVersion: '2.1.1'
      }
    })

    return reporter.init()
  })

  it('should apply defaultPhantomjsVersion global option', function () {
    reporter['phantom-pdf'].definition.options.phantoms[0].version.should.be.eql('2.1.1')
    reporter['phantom-pdf'].definition.options.phantoms[1].version.should.be.eql('1.9.8')

    var request = {
      template: { content: 'Hey', recipe: 'phantom-pdf', engine: 'none' },
      options: { debug: { logsToResponseHeader: true } }
    }

    return reporter.render(request, {}).then(function (response) {
      response.headers['Debug-Logs'].should.match(new RegExp(reporter['phantom-pdf'].definition.options.phantoms[0].version))
    })
  })
})
