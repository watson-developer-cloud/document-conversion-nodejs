'use strict';

var watson = require('watson-developer-cloud');
var fs = require('fs');

var credentials = {
  username: '<username>',
  password: '<password>',
  version: 'v1-experimental'
};

var document_conversion = watson.document_conversion(credentials);

// upload the sample files to the service and update the ids in demo.js with the ids
// we get back
['samplePDF.pdf', 'sampleHTML.html', 'sampleWORD.docx'].forEach(function(filename) {
  document_conversion.uploadDocument({
    file: fs.createReadStream(__dirname + '/public/data/' + filename)
  }, function(err, doc) {
    if (err)
      console.log('error uploading', filename);
    else
      console.log('filename', filename, 'is:', doc.id);
  });
});
