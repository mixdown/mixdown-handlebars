var BasePlugin = require('mixdown-app').Plugin;
var _ = require('lodash');
var Template = require('./template.js');
var handlebars = require('handlebars/runtime.js')['default'];

module.exports = BasePlugin.extend({

  init: function(options) {
    this.handlebars = handlebars;

    this._templates = {};

    var self = this;
    _.each(options.precompiled, function(fn, name) {
      self._templates[name] = new Template(name, fn, self.handlebars);
    });

  },

  templates: function() {
    return this._templates || {};
  },

  handlebars: null

});
