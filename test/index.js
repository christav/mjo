/**
* Copyright (c) Microsoft.  All rights reserved.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/

'use strict';

var joe = require('joe');
var fs = require('fs');
var path = require('path');

//
// Async foreach for arrays.
//
function eachAsync(array, iterator, done) {
  if (array.length === 0) {
    return done();
  }

  iterator(array[0], function (err) {
    if (err) { return done(err); }
    eachAsync(array.slice(1), iterator, done);
  });
}

//
// recursively walk directories, call function on each file
// iterator takes (path, stat, callback).
//
function walk(directories, iterator, done) {
  if (typeof directories === 'string') {
    directories = [directories];
  }

  if (directories.length === 0) {
    return done();
  }

  fs.readdir(directories[0], function (err, files) {
    if (err) { return done(err); }

    var filepaths = files
      .map(function (filename) { return path.join(directories[0], filename) });

    var newdirs = [];
    eachAsync(filepaths, function (path, callback) {
      var stat = fs.stat(path, function (err, filestats) {
        if (err) { return callback(err); }
        if (filestats.isDirectory()) {
          newdirs.push(path);
          return callback();
        } else {
          iterator(path, filestats, callback);
        }
      });
    },
    function (err) {
      if (err) { return done(err); }
      walk(directories.slice(1).concat(newdirs), iterator, done);
    });
  });
}

walk(__dirname, function(path, stats, done) {
  if (stats.isFile() && /-test\.js$/.test(path)) {
    require(path);
  }
  done();
}, function () {
});
