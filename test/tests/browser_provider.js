var App = require('mixdown-app').App;
var YourPlugin = require('../../lib/browser_provider.js');
var assert = require('assert');
var handlebars = require('handlebars/runtime.js')['default'];
var precompiled_templates = require('../../tmp/task/templates.js');

suite('Browser View Provider', function() {
  var app = new App();

  setup(function(done) {

    // create plugin
    var p = new YourPlugin({
      handlebars: handlebars,
      precompiled: precompiled_templates
    });

    // attach it
    app.use(p, 'browser_provider');

    app.setup(done);
  });

  test('Render template from pre-compiled source', function(done) {
    assert.equal(typeof(app.browser_provider), 'object', 'Interface should exist');
    debugger;
    var templates = app.browser_provider.templates();
    // console.log(JSON.stringify(templates));
    assert.equal(templates.one.template(), 'One!', 'One template should be correct');
    assert.equal(templates.two.template(), 'Two!', 'Two template should be correct');
    assert.equal(templates['three/index'].template(), 'Three!', 'Three template should be correct');

    done();
  });
});