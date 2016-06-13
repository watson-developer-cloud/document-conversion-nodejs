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
/* eslint no-unused-vars: "off" */

'use strict';

var id = '';
var fileExtension = '';

$(document).ready(function() {
  $('#fileupload').fileupload({
    dataType: 'json',
    dropZone: $('.dropzone'),
    acceptFileTypes: /(\.|\/)(pdf|doc|docx|html)$/i,
    add: function(e, data) {
      if (data.files && data.files[0]) {
        $('.upload--file-chooser-name').html(data.files[0].name);
        $('._content--choose-output-format.active').removeClass('active');
        $('._content--output.active').removeClass('active');

        // check file size
        if (data.files[0].size > 1024000) {
          showError('The file size exceeds the limit allowed. The maximum file size is 1 MB.');
          return;
        } else {
          hideError();
        }

        $('._content--choose-output-format').addClass('active');

        data.submit().complete(function(result) {
          id = result.responseJSON.id;
          fileExtension = result.responseJSON.id.split('.').pop();

          if (fileExtension === 'pdf') {
            var displayPdf = '<div class="file-display--input-pdf-container base--textarea">' +
            '<object class="file-display--input-pdf-object" data="/files/' + id + '" type="application/pdf">' +
            '<embed class="file-display--input-pdf-embed" src="/files/' + id + '" type="application/pdf">' + '</object>' + '</div>';

            $('#display_input_doc').html(displayPdf);
            $('.sample--list-item-tab.active').removeClass('active');
            $('.upload--container.active').removeClass('active');
            $('.format--list-item-tab.active').removeClass('active');
            $('.upload--container').addClass('active');
            $('.code--output-code').empty();
          }

          if (fileExtension === 'docx' || fileExtension === 'doc') {
            var displayWord = '<iframe class="file-display--word-file" src=""></iframe>';
            $('#display_input_doc').html(displayWord);
            var url = 'https://docs.google.com/gview?url=' + location.protocol + '\/\/' + location.host + '\/files\/' + id + '&embedded=true';
            $('.file-display--word-file').attr('src', url);

            $('.sample--list-item-tab.active').removeClass('active');
            $('.upload--container.active').removeClass('active');
            $('.format--list-item-tab.active').removeClass('active');
            $('.upload--container').addClass('active');
            $('.code--output-code').empty();
          }

          if (fileExtension === 'html' || fileExtension === 'htm') {
            $.ajax({
              url: '/files/' + id,
              dataType: 'html',
              success: function(dataAsHtml) {
                var displayHtml = '<pre class="code--input-html-pre language-markup"><code class="base--code language-markup code--input-html-code"></code></pre>';
                $('#display_input_doc').html(displayHtml);
                $('.code--input-html-code').text(dataAsHtml);
              },
              error: _error
            });

            $('.sample--list-item-tab.active').removeClass('active');
            $('.upload--container.active').removeClass('active');
            $('.format--list-item-tab.active').removeClass('active');
            $('.upload--container').addClass('active');
            $('.code--output-code').empty();
          }

          $('.download--input-icon').attr('href', '/files/' + id + '?download=true&filename=' + id);
          var top = document.getElementById('upload-your-document').offsetTop;
          window.scrollTo(0, top);
        });
      }
    },
    error: _error
  });

  function _error(xhr) {
    $('._content--choose-output-format.active').removeClass('active');
    $('._content--output.active').removeClass('active');
    var response = JSON.parse(xhr.responseText);
    if (response.error) {
      showError(response.error);
    }
  }

  $('.format--list-item-tab').click(function() {
    var outputFormat = $(this).attr('data-attr');
    var outputType = $(this).attr('data-type');

    if (outputFormat === 'ANSWER_UNITS') {
      $('.description--answer-unit').addClass('active');
    } else {
      $('.description--answer-unit.active').removeClass('active');
    }
    var params = $.param({
      document_id: id,
      conversion_target: outputFormat
    });

    $.ajax({
      headers: {
        'csrf-token': $('meta[name="ct"]').attr('content')
      },
      url: '/api/convert?' + params,
      success: function(data) {
        var text = data;
        if (outputType === 'json') {
          text = JSON.stringify(data, null, 2);
        }
        $('.code--output-code').text(text);
        $('.download--output-icon').attr('href', '/api/convert?' + params + '&download=true');
      },
      error: _error
    });

    $('._content--output.active').removeClass('active');
    $('._content--output').addClass('active');

    $('.format--list-item-tab.active').removeClass('active');
    $(this).addClass('active');

    var top = document.getElementById('choose-output-format').offsetTop;
    window.scrollTo(0, top);
  });

  /**
   * Event handler for reset button
   */
  $('.reset-button').click(function() {
    location.reload();
  });
});

function convertSampleHtml() {
  hideError();
  id = 'sampleHTML.html';
  clearFileUpload();
  fileExtension = 'html';
  $('.download--input-icon').attr('href', '/files/' + id + '?download=true');

  $.ajax({
    url: '/files/' + id,
    dataType: fileExtension,
    success: function(data) {
      var displayHtml = '<pre class="code--pre language-markup"><code class="base--code language-markup code--input-html-code"></code></pre>';
      $('#display_input_doc').html(displayHtml);
      $('.code--input-html-code').text(data);
    }
  });

  $('._content--choose-output-format.active').removeClass('active');
  $('._content--output.active').removeClass('active');
  $('._content--choose-output-format').addClass('active');
  $('.sample--list-item-tab.active').removeClass('active');
  $('.upload--container.active').removeClass('active');
  $('.format--list-item-tab.active').removeClass('active');
  $('.sample--list-item-tab:eq(0)').addClass('active');
  $('.code--output-code').empty();

  var top = document.getElementById('upload-your-document').offsetTop;
  window.scrollTo(0, top);
}

function convertSampleDocx() {
  hideError();
  id = 'sampleWORD.docx';
  clearFileUpload();
  fileExtension = 'docx';
  $('.download--input-icon').attr('href', '/files/' + id + '?download=true');

  var displayWord = '<iframe class="file-display--word-file" src=""></iframe>';
  $('#display_input_doc').html(displayWord);
  var url = 'https://docs.google.com/gview?url=' + location.protocol + '\/\/' + location.host + '\/files\/' + id + '&embedded=true';
  $('.file-display--word-file').attr('src', url);

  $('._content--choose-output-format.active').removeClass('active');
  $('._content--output.active').removeClass('active');
  $('._content--choose-output-format').addClass('active');
  $('.sample--list-item-tab.active').removeClass('active');
  $('.upload--container.active').removeClass('active');
  $('.format--list-item-tab.active').removeClass('active');
  $('.sample--list-item-tab:eq(1)').addClass('active');
  $('.code--output-code').empty();

  var top = document.getElementById('upload-your-document').offsetTop;
  window.scrollTo(0, top);
}

function convertSamplePdf() {
  hideError();
  id = 'samplePDF.pdf';
  clearFileUpload();
  fileExtension = 'pdf';

  $('.download--input-icon').attr('href', '/files/' + id + '?download=true');

  var displayPdf = '<div class="file-display--input-pdf-container base--textarea">' +
  '<object class="file-display--input-pdf-object" data="/files/' + id + '" type="application/pdf">' +
  '<embed class="file-display--input-pdf-embed" src="/files/' + id + '" type="application/pdf">' + '</object>' + '</div>';

  $('._content--choose-output-format.active').removeClass('active');
  $('._content--output.active').removeClass('active');
  $('._content--choose-output-format').addClass('active');
  $('#display_input_doc').html(displayPdf);
  $('.sample--list-item-tab.active').removeClass('active');
  $('.upload--container.active').removeClass('active');
  $('.format--list-item-tab.active').removeClass('active');
  $('.sample--list-item-tab:eq(2)').addClass('active');
  $('.code--output-code').empty();

  var top = document.getElementById('upload-your-document').offsetTop;
  window.scrollTo(0, top);
}

function showError(message) {
  $('.error').text(message);
  $('.error').show();
}

function hideError() {
  $('.error').hide();
}

function clearFileUpload() {
  hideError();
  $('#input-chooser-input').val('');
  $('.upload--file-chooser-name').html('');
}

/*
Tabbed Panels js
*/
(function() {
  $('.tab-panels--tab').click(function(e) {
    e.preventDefault();
    var self = $(this);
    var inputGroup = self.closest('.tab-panels');
    var idName = null;

    inputGroup.find('.active').removeClass('active');
    self.addClass('active');
    idName = self.attr('href');
    $(idName).addClass('active');
  });
})();
