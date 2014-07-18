var HB = require('./lib/hb.js');
var BrowserProvider = require('./lib/browser_provider.js');
var _ = require('lodash');
var handlebars = require('handlebars/runtime.js');

module.exports = HB.extend({
  init: function(options) {
    this._super(options);

    // pass dev flag down.
    view_options.handlebars = this.handlebars;
    this.view_provider = new BrowserProvider();
  },
  // create an instance of handlebars for this plugin to use.
  handlebars: handlebars,

  // This is a server plugin so it should crawl the file system
  view_provider: null
});