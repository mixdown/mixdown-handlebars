var App = require('mixdown-app').App;
var YourPlugin = require('../../lib/server_provider.js');
var assert = require('assert');

suite('Server View Provider', function() {
  var app = new App();

  setup(function(done) {
    this.timeout(50000);
    // create plugin
    var p = new YourPlugin({
      base: [
        './test/fixture/server/views',
        './test/fixture/server/views2',
      ],
      ext: "html"
    });

    // attach it
    app.use(p, 'server_provider');

    app.setup(done);
  });

  test('Test template crawl', function(done) {
    assert.equal(typeof(app.server_provider), 'object', 'Interface should exist');

    var templates = app.server_provider.templates();
    // console.log(JSON.stringify(templates));
    assert.equal(templates.one.markup, 'One!', 'One template should be correct');
    assert.equal(templates.two.markup, 'Two!', 'Two template should be correct');
    assert.equal(templates.five.markup, 'Five!', 'Five template should be correct');
    assert.equal(templates['three/index'].markup, 'Three!', 'Three template should be correct');

    done();
  });
});
