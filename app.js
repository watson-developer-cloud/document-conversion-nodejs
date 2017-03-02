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


require('dotenv').load({ silent: true });
const express = require('express');
const app = express();
const DocumentConversionV1 = require('watson-developer-cloud/document-conversion/v1');
const fs = require('fs');
const path = require('path');
const multer = require('multer');


// Bootstrap application settings
require('./config/express')(app);


const documentConversion = new DocumentConversionV1({
  // If unspecified here, the DOCUMENT_CONVERSION_USERNAME and DOCUMENT_CONVERSION_PASSWORD env properties will be checked
  // After that, the SDK will fall back to the bluemix-provided VCAP_SERVICES environment property
  // username: '<username>',
  // password: '<password>',
  version_date: '2015-12-01',
});

const types = {
  ANSWER_UNITS: '.json',
  NORMALIZED_HTML: '.html',
  NORMALIZED_TEXT: '.txt',
};

const samples = ['sampleHTML.html', 'samplePDF.pdf', 'sampleWORD.docx'];
const uploadFolder = path.join(__dirname, 'uploads/');
const sampleFolder = path.join(__dirname, 'public/data/');

/**
 * Returns the file path to a previously uploaded file or a sample file
 * @param  {String} filename the file name
 * @return {String} absolute path to the file or null if it doesn't exists
 */
function getFilePath(filename) {
  if (samples.indexOf(filename) !== -1) {
    return sampleFolder + filename;
  }
  if (fs.readdirSync(uploadFolder).indexOf(filename) !== -1) {
    return uploadFolder + filename;
  }
  return null;
}

app.get('/', (req, res) => {
  res.render('index', {
    BLUEMIX_ANALYTICS: process.env.BLUEMIX_ANALYTICS,
  });
});

// Setup the upload mechanism
const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, './uploads/');
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

/*
 * Uploads a file
 */
app.post('/files', upload.single('document'), (req, res, next) => {
  if (!req.file && !req.file.path) {
    return next({
      error: 'Missing required parameter: file',
      code: 400,
    });
  }
  res.json({
    id: req.file.filename,
  });
});

/*
 * Converts a document
 */
app.get('/api/convert', (req, res, next) => {
  const file = getFilePath(req.query.document_id);
  const params = {
    conversion_target: req.query.conversion_target,
    file: file ? fs.createReadStream(file) : null,
  };

  documentConversion.convert(params, (err, data) => {
    if (err) {
      return next(err);
    }
    const type = types[req.query.conversion_target];
    res.type(type);
    if (req.query.download) {
      res.setHeader('content-disposition', `attachment; filename=output-${Date.now()}.${type}`);
    }
    res.send(data);
  });
});

/*
 * Returns an uploaded file from the service
 */
app.get('/files/:id', (req, res) => {
  const file = getFilePath(req.params.id);
  res.sendFile(file);
});

// error-handler settings
require('./config/error-handler')(app);

module.exports = app;
