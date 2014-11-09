/*
 * grunt-wd-ct
 * https://github.com/sideroad/grunt-wd-ct
 *
 * Copyright (c) 2014 sideroad
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('wdct', 'Execute combitorial testing with wd.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({}),
        done = this.async(),
        WdCT = require('wd-ct'),
        async = require('async'),
        _ = require('lodash'),
        findup = require('findup-sync'),
        path = require('path'),
        parallel = options.parallel,
        saucelabs = options.saucelabs,
        files = this.files;

    // Arguments will be use src instead of original src
    if(this.args.length){
      files = [{
        src: this.args
      }];
    }

    // Iterate over all specified file groups.
    (parallel && saucelabs ? async.each : async.eachSeries).call( async, files, function(f, callback) {

      (parallel && saucelabs ? async.each : async.eachSeries).call( async, f.src, function(file, callback){
        var opts = _.extend({
              interaction: 'interaction.js',
              testcase: '*.xlsx'
            }, options, {
              debug: grunt.option('debug'),
              info: grunt.option('info'),
              error: grunt.option('error'),
              force: grunt.option('force')
            }),
            interaction = path.relative( process.cwd(), findup(opts.interaction, {cwd: file})),
            testcases = grunt.file.expand({cwd: file}, opts.testcase);

        (parallel && saucelabs ? async.each : async.eachSeries).call( async, testcases, function(testcase, callback){
          testcase = path.join(file, testcase);
          opts.interaction = interaction;
          opts.testcase = testcase;

          grunt.log.writeln('Executing ['+testcase+'] with ['+interaction+']');
          new WdCT(opts).then(function(){
            callback();
          }, function(err){
            grunt.log.error('Error on ['+testcase+'] with ['+interaction+']');
            grunt.log.error(err);
            done(false);
          });

        }, function(){
          callback();
        });
      }, function(){
        callback();
      });
    }, function(){
      done();
    });
  });

};
