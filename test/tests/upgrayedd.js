var App = require('mixdown-app').App;
var YourPlugin = require('../../index.js');
var assert = require('assert');
var fs = require('fs');
var gold = fs.readFileSync(require.resolve('../fixture/render/upgrayedd/gold.html'), 'utf-8');

suite('Sweet: Upgrayedd', function() {
  var app = new App();

  setup(function(done) {
    this.timeout(10000);

    // create plugin
    var p = new YourPlugin({

      views: {
        base: ['./test/fixture/render/upgrayedd'],
        ext: "html"
      }
    });

    // attach it
    app.use(p);

    app.setup(done);
  });

  test('Hydrate helper', function(done) {
    debugger;
    var html = app.view_engine.render('upgrayedd', {
      title: "Smock",
      price: "5.34",
      content: "And at only ${{price}}!"
    });

    assert.equal(html, gold, 'Content should match gold');
    done();
  });
});