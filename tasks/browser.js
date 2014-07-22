var MixdownHandlebars = require('../index.js');
var fs = require('fs');
var path = require('path');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('mixdown-handlebars', 'Generates client (browser) controller code from mixdown-handlebars.', function() {
    // Tell Grunt this task is asynchronous.
    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      development: false,
      views: {
        base: ['./views'],
        ext: "html"
      },
      dest: './public/js/templates'
    });

    // Load the plugin and set the view options.
    var hb = new MixdownHandlebars(options);
    var str_buf = [];

    hb._setup(function(err) {
      var templates = {};
      var _t = hb.templates();

      for (var k in _t) {
        str_buf.push('  "' + k + '"' + ': ' + _t[k].compiled.toString());
      }

      grunt.file.write(path.join(options.dest, 'templates.js'), 'module.exports = {\n' + str_buf.join(',\n  ') + '\n};');
      done();
    });

  });
};
