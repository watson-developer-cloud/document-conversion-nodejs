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

var express  = require('express'),
  app        = express(),
  bluemix    = require('./config/bluemix'),
  extend     = require('util')._extend,
  watson     = require('watson-developer-cloud'),
  multiparty = require('multiparty');

// Bootstrap application settings
require('./config/express')(app);

// if bluemix credentials exists, then override local
var credentials =  extend({
  username: '<username>',
  password: '<password>',
  version: 'v1-experimental'
}, bluemix.getServiceCreds('document_conversion')); // VCAP_SERVICES

var document_conversion = watson.document_conversion(credentials);

var types = {
  'ANSWER_UNITS': '.json',
  'NORMALIZED_HTML': '.html',
  'NORMALIZED_TEXT': '.txt'
};

/*
 * Uploads a file
 */
app.post('/files', function(req, res, next) {
  var form = new multiparty.Form({autoFields: true});
  form.on('error', next);

  form.on('part', function(part) {
    console.log('filename: ', part.filename);
    part.path = part.path || part.filename;
    document_conversion.uploadDocument({file: part}, function (err, result) {
      if (err) {
        return res.status(err.code || 500).send(err);
      }
      res.json({id: result.id, filename: part.filename});
    });

    part.on('error', next);
  });
  form.parse(req);
});

/*
 * Converts a document using the service
 */
app.get('/convert_document/:document_id/:conversion_target', function(req, res) {
  if (!types[req.params.conversion_target])
    return res.status(400).json({
      code:400,
      error: 'Unvalid conversion type: '+ req.params.conversion_target
    });

  document_conversion.convert(req.params, function(err, data) {
    if (err) {
      console.error('document conversion error:', err.stack || err);
      return res.status(err.code || 500).json(err);
    }
    res.type(types[req.params.conversion_target]);
    if (req.query.download){
      res.setHeader('content-disposition','attachment; filename=' + req.query.filename);
    }
    res.send(data);
  });
});

/*
 * Returns an uploaded file from the service
 */
app.get('/files/:id', function(req, res) {
  document_conversion.getDocument({id: req.params.id})
  .on('response', function(response) {
    if (req.query.download) {
     response.headers['content-disposition'] = 'attachment; filename=' + req.query.filename;
    }
  })
  .pipe(res);
});

// error-handler settings
require('./config/error-handler')(app);

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
