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
// Is this a test file?
//
function isTestFile(dirname, filename) {
  var pathname = path.join(dirname, filename);
  var s = fs.statSync(pathname);
  return s.isFile() && /-test\.js$/.test(filename);
}

fs.readdir(__dirname, function (err, files) {
  if (err) {
    console.log('Error: Could not read files,', err);
    return;
  }

  var testfiles = files.filter(function (filename) {
    return isTestFile(__dirname, filename);
  })
  .map(function (filename) {
    return path.join(__dirname, filename);
  });

  testfiles.forEach(function (testfile) {
    require(testfile);
  });
});
