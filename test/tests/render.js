var App = require('mixdown-app').App;
var YourPlugin = require('../../index.js');
var assert = require('assert');
var fs = require('fs');
var gold = fs.readFileSync(require.resolve('../fixture/render/gold.html'), 'utf-8');

suite('Render', function() {
  var app = new App();

  setup(function(done) {
    this.timeout(10000);

    // create plugin
    var p = new YourPlugin({

      views: {
        base: [
          './test/fixture/render/default',
          './test/fixture/render/overrides'
        ],
        ext: "html"
      }
    });

    // attach it
    app.use(p);

    app.setup(done);
  });

  test("Render valid templates", function(done) {
    var html = app.view_engine.render('index', {
      languages: {
        spanish: {
          hello: 'Hola'
        },
        french: {
          hello: "Bonjour"
        },
        english: {
          hello: 'Hello'
        }
      }
    });

    assert.equal(html, gold, 'Content should match gold');
    done();
  });



  test("Render templates and view resolver", function(done) {
    var templates = app.view_engine.templates();

    assert.ok(templates.index, 'View "index" should exist');
    assert.ok(templates.hello, 'View "hello" should exist');
    assert.ok(/Variation #2/.test(app.view_engine.render('hello')), 'View "hello" should be variation 2');
    done();
  });

  test('Attempt to render missing template', function(done) {
    assert.throws(app.view_engine.render('hoffa', {}), Error, 'Should throw');
    done();
  });

  test('Attempt to render template with compile error', function(done) {
    assert.throws(app.view_engine.render('bad', {}), Error, 'Should throw');
    done();
  });
});