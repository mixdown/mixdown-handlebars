var Class = require('class.extend');

module.exports = Class.extend({
  init: function(name, markup_or_precompiled, handlebars) {
    this.name = name;
    this.handlebars = handlebars;

    if (typeof(markup_or_precompiled) === 'function') {
      this.compiled = markup_or_precompiled;
    } else {
      this.markup = markup_or_precompiled;
      try {
        this.compiled = eval('(' + this.handlebars.precompile(this.markup) + ')');
      } catch (e) {
        this.compiled = function() {
          throw new Error('Error compiling template');
        }
      }
    }

    this.template = this.handlebars.template(this.compiled);
    this.handlebars.registerPartial(this.name, this.template);
  },
  markup: null,
  compiled: null,
  template: null,
  handlebars: null,
  name: null
});