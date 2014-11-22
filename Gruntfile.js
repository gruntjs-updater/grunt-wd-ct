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
      main: {
        options: {
          interaction: 'interaction.js',
          testcase: '*.csv',
          debug: false,
          browsers: [
            {
              browserName: 'internet explorer',
              version: '8',
              platform: 'Windows 7'
            },
            {
              browserName: 'internet explorer',
              version: '9',
              platform: 'Windows 7'
            },
            {
              browserName: 'internet explorer',
              version: '10',
              platform: 'Windows 7'
            },
            {
              browserName: 'internet explorer',
              version: '11',
              platform: 'Windows 8.1'
            },
            {
              browserName: 'Chrome',
              platform: 'Windows 7'
            },
            {
              browserName: 'Firefox',
              platform: 'Windows 7'
            },
            {
              browserName: 'Safari',
              platform: 'Mac'
            }
          ],
          parallel: true,
          saucelabs: true,
          tap: 'tmp/test.tap',
          build: new Date().getTime()
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
