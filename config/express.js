/**
 * Copyright 2015 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// Module dependencies
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var findRemoveSync = require('find-remove');
var path = require('path');
var morgan = require('morgan');
var expressBrowserify = require('express-browserify');

module.exports = function(app) {
  app.enable('trust proxy');

  // Only loaded when running in Bluemix
  if (process.env.VCAP_APPLICATION) {
    require('./security')(app);
  }

  // automatically bundle the front-end js on the fly
  // note: this should come before the express.static since bundle.js is in the public folder
  var isDev = (app.get('env') === 'development');
  var browserifyier = expressBrowserify('./public/js/bundle.jsx', {
    watch: isDev,
    debug: isDev,
    extension: [ 'jsx' ],
    transform:  [["babelify", { "presets": ["es2015", "react"] }]]
  });
  if (!isDev) {
    browserifyier.browserify.transform('uglifyify', {global:true})
  }
  app.get('/js/bundle.js', browserifyier);

  // Configure Express
  app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
  app.use(bodyParser.json({ limit: '1mb' }));
  app.use(express.static(path.join(__dirname, '..', 'public')));
  app.use(express.static(path.join(__dirname, '..', 'node_modules/watson-react-components/dist/')));
  app.use(morgan('dev'));

  // Setup the upload mechanism
  var storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });

  app.upload = multer({
    storage: storage
  });

  // Remove files older than 1 hour every hour.
  setInterval(function() {
    var removed = findRemoveSync(path.join(__dirname, '..', 'uploads'), { age: { seconds: 3600 } });
    if (removed.length > 0) {
      console.log('removed:', removed);
    }
  }, 3600000);
};
