var BasePlugin = require('mixdown-app').Plugin;
var _ = require('lodash');
var dir = require('node-dir');
var async = require('async');
var path = require('path');
var fs = require('graceful-fs');
var handlebars = require('handlebars');
var Template = require('./template.js');

module.exports = BasePlugin.extend({
  init: function(options) {
    this._super(options);

    // if it is passed, then let's use it b/c it is a shared instance.
    this.handlebars = this._options.handlebars || handlebars;

    _.defaults(this._options, {
      development: false,
      base: ['./views'],
      ext: "html"
    });

    this._options.base = Array.isArray(this._options.base) ? this._options.base : [this._options.base];
  },
  handlebars: null,
  _templates: null,
  _files: null,
  _watching: false,

  watch: function() {
    var self = this;

    if (this._options.development && !this._watching) {
      this._watching = true;

      // call setup on watch change event.
      _.each(this._files, function(file) {
        fs.watch(file, function() {
          self.emit('mixdown-handlebars_template_changed', file);

          self._setup(function(err) {
            self.emit('mixdown-handlebars_reloaded', err);
          });
        });
      });
    }

  },

  templates: function() {
    return this._templates || {};
  },

  _setup: function(done) {
    var self = this;
    var ext = this._options.ext;

    // initialize the private var.
    this._templates = {};
    this._files = [];

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
              self._templates[template_key] = new Template(template_key, content, self.handlebars);

              // add to file watcher list.
              self._files.push(filename);
            }

            next();
          },
          function(err) {
            cb(errCrawl || err);
          });
      };
    });

    async.waterfall(ops, function(err, results) {
      self.watch();
      done(err, results);
    });
  }
});