var MixdownHandlebars = require('../index.js');
var fs = require('fs');
var _ = require('lodash');
var through = require('through2');

module.exports = function(options) {

  _.defaults(options, {
    view: {
      base: ['./views'],
      ext: "html"
    }
  });

  // Load the plugin and set the view options.
  var hb = new MixdownHandlebars(options);
  var str_buf = [];
  var stream = through();

  hb._setup(function(err) {
    var code;

    if (err) {
      code = err.stack;
    } else {
      var templates = {};
      var _t = hb.templates();

      for (var k in _t) {
        str_buf.push('  "' + k + '"' + ': ' + _t[k].compiled.toString());
      }

      code = 'module.exports = {\n' + str_buf.join(',\n  ') + '\n};';
    }

    // write and end
    stream.write(code);
    stream.end();

  });


  return stream;
};