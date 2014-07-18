module.exports = function(grunt) {
  grunt.initConfig({

    'mixdown-handlebars': {
      options: {
        dest: './tmp/task',
        views: {
          base: './test/fixture/server/views',
          ext: "html"
        }
      }
    }
  });

  grunt.task.loadTasks('./tasks');

  grunt.registerTask('default', ['mixdown-handlebars']);
};