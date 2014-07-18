/** Upgrades to standard HB helpers **/
var _ = require('lodash');

module.exports = function(Handlebars) {

  // Override the default version of each.
  Handlebars.registerHelper('each', function(context, options) {
    var buffer = [],
      that = this;

    _.each(context, function(v, k) {
      try {
        buffer.push(options.fn(_.extend(_.clone(that), {
          key: k,
          value: v
        })));
      } catch (e) {
        buffer.push(e);
      }
    });

    return buffer.join('');
  });

  // Create a range function that will iterate numbers from 0 -> max
  // This is mirrors the underscore _.range function.
  // http://documentcloud.github.com/underscore/#range
  Handlebars.registerHelper('range', function(expression, options) {
    var buffer = [],
      stop = 0,
      that = this;

    if (typeof(expression) == 'string') {
      with(this) {
        stop = eval(expression);
      }
    } else {
      stop = expression;
    }

    _.each(_.range((options.hash.start || 0), stop, (options.hash.step || 1)), function(v, k) {
      try {
        buffer.push(options.fn(_.extend(_.clone(that), {
          key: k,
          value: v
        })));
      } catch (e) {
        buffer.push(e);
      }
    });

    return buffer.join('');
  });

  // if with evaluation.
  Handlebars.registerHelper('ifeval', function(expression, options) {
    var conditional = false;
    with(this) {
      conditional = eval(expression);
    }
    return conditional ? options.fn(this) : options.inverse(this);
  });

  // Similar to standard print {{value}}, but with an optional fallback value.
  // Ex: {{def foo def="goo"}} will print the value of foo if exists, otherwise it will print "goo"
  // If def is omitted, then an empty string is printed.
  Handlebars.registerHelper('def', function(expression, options) {
    var val = null,
      def = options.hash.def || '';

    try {
      with(this) {
        val = eval(expression);
      }
    } catch (e) {
      val = expression;
    }

    return val ? val : def;
  });

  // Allowing dynamic loading of partials based on value of variable in context
  // Call is made like {{{partial "partial.root" partial_name ctx}}} or {{{partial full_partial_string ctx}}}
  Handlebars.registerHelper('partial', function(root, name, ctx, hash) {
    var ps = Handlebars.partials;
    var path;

    if (typeof name === 'object') {
      var tmp = name;
      name = '';
      hash = ctx;
      ctx = tmp;
    } else if (typeof name === 'undefined') {
      name = '';
    };
    path = root + ((name !== '') ? ('.' + name) : name);

    if (typeof ps[path] != 'function')
      ps[path] = Handlebars.compile(ps[path]);
    return ps[path](ctx, hash);
  });

};