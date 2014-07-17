var App = require('mixdown-app').App;
var YourPlugin = require('../../lib/server_provider.js');
var assert = require('assert');
var ncp = require('ncp').ncp;
var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');

var src = path.join(process.cwd(), './test/fixture/server/views');
var dest = path.join(process.cwd(), './tmp/file_watch_test/views');

var createApp = function(dev_flag) {
  var app = new App();

  // create plugin
  var p = new YourPlugin({
    development: dev_flag,
    base: './tmp/file_watch_test/views',
    ext: "html"
  });

  // attach it
  app.use(p, 'server_provider');

  return app;
};


suite('File Watch', function() {

  setup(function(done) {

    fs.rmdir(dest, function() {
      mkdirp(dest, function(err) {

        if (err) {
          done(err);
          return;
        }

        ncp.limit = 16;
        ncp(src, dest, done);
      });
    });
  });

  test('File Watch Default - Should not reload', function(done) {
    var app = createApp(false);

    app.setup(function(err) {

      assert.ifError(err, 'Should not return error on init');
      var old_templates = app.server_provider.templates();

      fs.writeFile(path.join(dest, 'one.html'), 'Four', function(err) {
        assert.ifError(err, 'Should not error on template write');

        // give time for file watcher to execute a re-crawl.
        setTimeout(function() {
          var new_templates = app.server_provider.templates();

          assert.equal(new_templates.one, old_templates.one, 'Template should not have changed.');

          done();
        }, 800);
      });

    });
  });


  test('File Watch Active - Should reload', function(done) {
    var app = createApp(true);

    app.setup(function(err) {

      assert.ifError(err, 'Should not return error on init');
      var old_templates = app.server_provider.templates();

      fs.writeFile(path.join(dest, 'one.html'), 'Four', function(err) {
        assert.ifError(err, 'Should not error on template write');

        // give time for file watcher to execute a re-crawl.
        setTimeout(function() {
          var new_templates = app.server_provider.templates();

          assert.equal(new_templates.one, 'Four', 'Template should have been updated.');

          done();
        }, 800);
      });

    });
  });

});