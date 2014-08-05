var HB = require('./lib/hb.js');
var ServerProvider = require('./lib/server_provider.js');
var _ = require('lodash');
var handlebars = require('handlebars');

module.exports = HB.extend({
  init: function(options) {
    this._super(options);

    // pass dev flag down.
    var view_options = _.defaults(_.pick(this._options, 'development', 'app'), options.views);
    view_options.handlebars = this.handlebars;
    this.view_provider = new ServerProvider(view_options);
  },
  // create an instance of handlebars for this plugin to use.
  handlebars: handlebars.create(),

  // This is a server plugin so it should crawl the file system
  view_provider: null
});
