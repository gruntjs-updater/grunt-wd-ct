/*
 * grunt-wd-ct
 * https://github.com/sideroad/grunt-wd-ct
 *
 * Copyright (c) 2014 sideroad
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    'wdct': {
      main: {
        options: {
          interaction: 'interaction.js',
          testcase: '*.csv'
        },
        src: ['test/fixtures/*']
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'wdct']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['wdct']);

};
