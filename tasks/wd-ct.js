/*
 * grunt-wd-ct
 * https://github.com/sideroad/grunt-wd-ct
 *
 * Copyright (c) 2014 sideroad
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  grunt.registerMultiTask('wdct', 'Execute combitorial testing with wd.', function() {
    var options = this.options({
          preserveFails: true,
          fails: 'lastfails.txt'
        }),
        done = this.async(),
        WdCT = require('wd-ct'),
        async = require('async'),
        _ = require('lodash'),
        findup = require('findup-sync'),
        path = require('path'),
        saucelabs = options.saucelabs,
        files = this.files,
        override = {},
        fs = require('fs'),
        tap = {write:function(){},end:function(){}},
        fails = {write:function(){},end:function(){}},
        seq = 1,
        cnt = {
          pass: 0,
          fail: 0
        };

    if(options.tap) {
      tap = fs.createWriteStream(options.tap);
      tap.write('TAP version 13\n');
    }

    // Arguments will be use src instead of original src
    if(this.args.length){
      files = [{
        src: this.args
      }];
    }

    if(grunt.option('info') !== undefined) {
      override = grunt.option('info');
    }
    if(grunt.option('debug') !== undefined) {
      override = grunt.option('debug');
    }
    if(grunt.option('error') !== undefined) {
      override = grunt.option('error');
    }

    if(grunt.option('lastfails') !== undefined ) {
      files = fs.existsSync(options.fails) && fs.readFileSync(options.fails, 'utf8').split('\n').filter(function(line){
        return line ? true : false;
      }).map(function(line){
        return {
          interaction: line.split(':')[0],
          src: [path.dirname( line.split(':')[1] )] ,
          testcase: [ path.basename( line.split(':')[1] ) ],
          rowNum: Number(line.split(':')[2])
        };
      }) || [];

    }

    if(fs.existsSync(options.fails)) {
      fs.unlinkSync(options.fails);
    }

    if(options.preserveFails) {
      fails = fs.createWriteStream(options.fails);
    }


    // Iterate over all specified file groups.
    async.eachSeries( files, function(f, callback) {

      async.eachSeries(f.src, function(file, callback){
        var opts = _.extend({
              interaction: 'interaction.js',
              testcase: '*.xlsx',
              rowNum: f.rowNum
            }, options, override),
            interaction = f.interaction ? f.interaction : 
                                          path.relative( process.cwd(), findup( opts.interaction, {cwd: file})),
            testcases = f.testcase ? f.testcase : grunt.file.expand({cwd: file}, opts.testcase);
        async.eachSeries( testcases, function(testcase, callback){
          testcase = path.join(file, testcase);

          opts.interaction = interaction;
          opts.testcase = testcase;
          opts.reporter = function(res){
            if(!res.err) {
              tap.write('ok '+seq+' - ' + testcase + ' - ' + interaction + ' ' +
                        '['+res.command+'-'+res.val+'] '+
                        '['+res.cap.platform+'-'+
                            res.cap.browserName+'-'+
                            res.cap.version+'] '+
                        'row['+res.row+'] '+
                        'col['+res.col+']\n');
              seq++;
              cnt.pass++;                
            } else {
              tap.write('not ok '+seq+' - ' + testcase + ' - ' + interaction + ' - '+res.command+'\n'+
                         '  ---\n'+
                         '    messeage: "Failed ['+ (res.command+'-'+res.val).replace(/\"/g, '\'').replace(/(\r?\n)|\:/g, '')+']"\n'+
                         '    dump: "'+ (res.err.message||'').replace(/\"/g, '\'').replace(/(\r?\n)|\:/g,'') + '"\n'+
                         '    platform: "'+ res.cap.platform+'"\n'+
                         '    browser: "'+ res.cap.browserName+'"\n'+
                         '    version: "'+ res.cap.version+'"\n'+
                         '    row: "'+ res.row+'"\n'+
                         '    col: "'+ res.col+'"\n'+
                         '  ...\n'+
                         (res.bailout ? 'Bail out!\n': ''));
              seq++;
              cnt.fail++;
              fails.write(interaction+':'+testcase+':'+res.row+'\n');
            }
          };

          grunt.log.writeln('Executing ['+testcase+'] with ['+interaction+']');

          new WdCT(opts).then(function(){
            callback();
          }, function(err){
            grunt.log.error('Error on ['+testcase+'] with ['+interaction+']');
            grunt.log.error(err);
            callback(err);
          });
        }, function(err){
          callback(err);
        });
      }, function(err){
        callback(err);
      });
    }, function(err){
      tap.write('# Pass: '+cnt.pass+'\n'+
                '# Fail: '+cnt.fail+'\n'+
                '1..'+(seq-1)+'\n');
      tap.end();
      fails.end();
      done(err);
    });
  });

};
