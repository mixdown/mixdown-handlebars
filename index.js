var HB = require('./lib/hb.js');
var ServerProvider = require('./lib/server_provider.js');

module.exports = HB.extend({
  init: function(options) {
    this._super(options);

    // pass dev flag down.
    var view_options = _.defaults(_.pick(this._options, 'development'), options.views);
    this.view_provider = new ServerProvider(view_options);
  },

  // This is a server plugin so it should crawl the file system
  view_provider: null
});