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

var express    = require('express'),
  app          = express(),
  watson       = require('watson-developer-cloud'),
  fs           = require('fs');
// Bootstrap application settings
require('./config/express')(app);

// if bluemix credentials exists, then override local
var credentials = {
  username: '<username>',
  password: '<password>',
  version_date: '2015-12-01',
  version: 'v1'
};

var document_conversion = watson.document_conversion(credentials);

var types = {
  'ANSWER_UNITS': '.json',
  'NORMALIZED_HTML': '.html',
  'NORMALIZED_TEXT': '.txt'
};

var samples = ['sampleHTML.html','samplePDF.pdf','sampleWORD.docx'];


var uploadFolder = __dirname + '/uploads/';
var sampleFolder = __dirname + '/public/data/';

/**
 * Returns the file path to a previously uploaded file or a sample file
 * @param  {String} filename the file name
 * @return {String} absolute path to the file or null if it doesn't exists
 */
function getFilePath(filename) {
  if (samples.indexOf(filename) !== -1) {
    return sampleFolder + filename;
  } else {
    if (fs.readdirSync(uploadFolder).indexOf(filename) !== -1)
      return uploadFolder + filename;
    else
      return null;
  }
}

app.get('/', function(req, res) {
  res.render('index', { ct: req._csrfToken });
});

/*
 * Uploads a file
 */
app.post('/files', app.upload.single('document'), function(req, res, next) {
  if (!req.file  && !req.file.path) {
    return next({
      error: 'Missing required parameter: file',
      code: 400
    });
  }
  res.json({ id: req.file.filename });
});

/*
 * Converts a document
 */
app.get('/api/convert', function(req, res, next) {
  var file = getFilePath(req.query.document_id);
  var params = {
    conversion_target : req.query.conversion_target,
    file: file ? fs.createReadStream(file) : null
  };

  document_conversion.convert(params, function(err, data) {
    if (err) {
      return next(err);
    }
    var type = types[req.query.conversion_target];
    res.type(type);
    if (req.query.download) {
      res.setHeader('content-disposition','attachment; filename=output-' + Date.now() + '.' + type);
    }
    res.send(data);
  });
});


/*
 * Returns an uploaded file from the service
 */
app.get('/files/:id', function(req, res) {
  var file = getFilePath(req.params.id);
  fs.createReadStream(file)
  .on('response', function(response) {
    if (req.query.download) {
     response.headers['content-disposition'] = 'attachment; filename=' + req.params.id;
    }
  })
  .pipe(res);
});

// error-handler settings
require('./config/error-handler')(app);

var port = process.env.VCAP_APP_PORT || 3000;
app.listen(port);
console.log('listening at:', port);
