var BasePlugin = require('mixdown-app').Plugin;
var _ = require('lodash');
var handlebars = require('handlebars');
var upgrayedd = require('./upgrayedd.js');

// Create a new plugin from the base plugin class.
// this._options is the options hash that was passed on init.
module.exports = BasePlugin.extend({
  _namespace_default: "view_engine",
  init: function() {
    this._super();

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

  // create an instance of handlebars for this plugin to use.
  handlebars: handlebars.create(),

  // This is defined on child classes to handle getting all the templates.
  view_provider: null,

  /**
   * Attaches to a Broadway app and exposes the render function
   * @params view {String} The name of the view to render.  This will be used by the view resolver to pull markup from file system (node.js) or other (client js)
   * @params data {Object} The view model to use when rendering.
   **/
  render: function(view, data) {
    var template = this.template_cache[view];
    var html;

    if (!template) {
      template = this.compile(view);
    }

    try {
      html = template(data);
    } catch (e) {
      html = e.stack;
    }

    return html;
  },

  compile: function(view) {

    this.template_cache[view] = this.templates(view) ? this.handlebars.compile(this.templates(view)) : function() {
      throw new Error("View Not Found - " + view);
    };

    return this.template_cache[view];
  },

  // raw templates
  templates: function(key) {
    var t = this.view_provider ? this.view_provider.templates() : {};
    return key ? t[key] : t;
  },

  template_cache: {},

  // _setup is part of the mixdown plugin interface.  Use this to initialize the plugin.
  // This is typically used to asynchronously init a db or api that is part of the plugin interface.
  _setup: function(done) {
    var self = this;

    var finish = function(err) {
      if (err) {
        done(err);
        return;
      }

      var templates = self.templates();
      // register each partial in case it is needed by view.
      _.each(templates, function(markup, key) {
        self.handlebars.registerPartial(key.replace(/\//g, '.'), markup);
      });

      done();
    };

    if (typeof(this.view_provider && this.view_provider._setup) === 'function') {
      this.view_provider._setup(finish);
    } else {
      finish();
    }
  }
});