var BasePlugin = require('mixdown-app').Plugin;
var _ = require('lodash');
var upgrayedd = require('./upgrayedd.js');

// Create a new plugin from the base plugin class.
// this._options is the options hash that was passed on init.
module.exports = BasePlugin.extend({
  _namespace_default: "view_engine",
  init: function(options) {
    this._super(options);

    _.defaults(this._options, {
      helpers: {},
      development: true,
      view: {
        base: (typeof(window) === 'undefined') ? process.cwd() : null,
        ext: "html"
      }
    });

    // attach our improvements to helpers.
    upgrayedd(this.handlebars);

  },

  // this is not initialized so that browser can init the runtime and server can init the full compiler version.
  handlebars: null,

  // This is defined on child classes to handle getting all the templates.
  view_provider: null,

  send: function(options, reject, resolve) {
    var html;
    var res = options.httpContext.response;
    var headers = _.defaults(options.headers || {}, {
      'Content-Type': 'text/html'
    });

    try {
      html = this.render(options.view, options.data);
    } catch (e) {

      if (typeof(reject) === 'function') {
        reject(e, options.httpContext);
        return;
      } else {
        throw e;
      }
    }

    res.writeHead(200, headers);
    res.end(html);

    if (typeof(resolve) === 'function') {
      resolve(e);
      return;
    }
  },

  /**
   * Attaches to a Broadway app and exposes the render function
   * @params view {String} The name of the view to render.  This will be used by the view resolver to pull markup from file system (node.js) or other (client js)
   * @params data {Object} The view model to use when rendering.
   **/
  render: function(view, data) {
    var html;
    var t = this.templates(view);

    if (!t) {
      html = (new Error('Template not found: ' + view)).stack;
      return;
    }

    try {
      html = t.template(data);
    } catch (e) {
      html = e.stack;
    }

    return html;
  },

  // raw templates
  templates: function(key) {
    var t = this.view_provider ? this.view_provider.templates() : {};
    return key ? t[key] : t;
  },

  // _setup is part of the mixdown plugin interface.  Use this to initialize the plugin.
  // This is typically used to asynchronously init a db or api that is part of the plugin interface.
  _setup: function(done) {

    if (typeof(this.view_provider && this.view_provider._setup) === 'function') {
      this.view_provider._setup(done);
    } else {
      done();
    }
  }
});
