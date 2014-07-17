var BasePlugin = require('mixdown-app').Plugin;
var _ = require('lodash');
var dir = require('node-dir');
var async = require('async');
var path = require('path');
var fs = require('fs');

module.exports = BasePlugin.extend({
  init: function(options) {
    this._super(options);

    _.defaults(this._options, {
      development: false,
      base: ['./views'],
      ext: "html"
    });

    this._options.base = Array.isArray(this._options.base) ? this._options.base : [this._options.base];

    debugger;
    if (this._options.development) {
      this.watch();
    }
  },

  watch: function() {

    // call setup on watch change event.
    var reload = this._setup.bind(this, function() {
      return;
    });

    _.each(this._options.base, function(filename) {
      fs.watch(filename, reload);
    });

  },

  templates: function() {
    return this._templates || {};
  },

  _setup: function(done) {
    var self = this;
    var ext = this._options.ext;

    // initialize the private var.
    this._templates = {};

    // generate search functions.
    var ops = _.map(this._options.base, function(b) {

      // join from cwd.
      var base = path.join(process.cwd(), b);
      var rxExt = new RegExp('.' + ext + '$');

      return function(cb) {
        var errCrawl;

        // match only filenames with ext
        dir.readFiles(base, {
            match: rxExt,
          }, function(err, content, filename, next) {

            if (err) {
              errCrawl = err;
            } else {

              // cache in the templates
              var template_key = filename.replace(base, '');
              template_key = template_key.replace(/^\//, '').replace(rxExt, '');
              self._templates[template_key] = content;
            }

            next();
          },
          function(err) {
            cb(errCrawl || err);
          });
      };
    });

    async.waterfall(ops, done);
  }
});