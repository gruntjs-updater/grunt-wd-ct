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
      tests: ['tmp/test.tap'],
    },

    // Configuration to be run (and then tested).
    'wdct': {
      mail: {
        options: {
          interaction: 'interaction.js',
          testcase: '*.csv',
          debug: 'tmp/debug.log',
          browsers: [
            {
              browserName: 'internet explorer',
              version: '11',
              platform: 'Windows 8.1'
            },
            {
              browserName: 'Chrome',
              platform: 'Windows 7'
            }
          ],
          errorScreenshot: 'tmp',
          parallel: true,
          saucelabs: true,
          tap: 'tmp/test.tap',
          build: new Date().getTime(),
          force: true
        },
        src: ['test/fixtures/*']
      }
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-release');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'wdct']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['wdct']);

};
