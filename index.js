var HB = require('./lib/hb.js');
var ServerProvider = require('./lib/server_provider.js');

module.exports = HB.extend({
  init: function(options) {
    this._super(options);
    this.view_provider = new ServerProvider(options.views);
  },

  // This is a server plugin so it should crawl the file system
  view_provider: null
});