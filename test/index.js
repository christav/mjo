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

var fs = require('fs');
var path = require('path');
var walk = require('walkdir');

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

function isTestScript(filename) {
  return /-test.js$/.test(filename);
}

var testScripts = [];

var walker = walk(__dirname);
walker.on('file', function (filename, stat) {
  if (isTestScript(filename)) {
    testScripts.push(filename);
  };
});

walker.on('end', function () {
  eachAsync(testScripts, function (script, done) {
    var suite = require(script);
    suite.onceDone(done);
  });
});
