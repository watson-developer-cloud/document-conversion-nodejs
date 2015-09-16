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
/* global $, convert_sample_html, convert_sample_pdf*/
'use strict';

var id = '';
var file_extension = '';

$(document).ready(function() {

  $('#fileupload').fileupload({
    dataType: 'json',
    dropZone: $('.dropzone'),
    acceptFileTypes: /(\.|\/)(pdf|doc|docx|html)$/i,
    maxFileSize: 512000, // 512 Kilobytes
    add: function(e, data) {
      if (data.files && data.files[0]) {
        $('.upload--file-chooser-name').html(data.files[0].name);
        $('._content--choose-output-format.active').removeClass('active');
        $('._content--output.active').removeClass('active');
        $('._content--choose-output-format').addClass('active');

        data.submit().complete(function(result) {
          id = result.responseJSON.id;
          file_extension = result.responseJSON.filename.split('.').pop();

          if (file_extension == 'pdf') {
            var display_pdf = '<div class="file-display--input-pdf-container base--textarea">' +
            '<object class="file-display--input-pdf-object" data="/files/' + id + '" type="application/pdf">' +
            '<embed class="file-display--input-pdf-embed" src="/files/' + id + '" type="application/pdf">' + '</object>' + '</div>';

            $('#display_input_doc').html(display_pdf);
            $('.sample--list-item-tab.active').removeClass('active');
            $('.upload--container.active').removeClass('active');
            $('.format--list-item-tab.active').removeClass('active');
            $('.upload--container').addClass('active');
            $('.code--output-code').empty();
          }

          if (file_extension === 'docx' || file_extension === 'doc') {
            var display_word = '<iframe class="file-display--word-file" src=""></iframe>';
            $('#display_input_doc').html(display_word);
            var url = 'https://docs.google.com/gview?url=' + location.protocol + '\/\/' + location.host + '\/files\/' + id + '&embedded=true';
            $('.file-display--word-file').attr('src', url);

            $('.sample--list-item-tab.active').removeClass('active');
            $('.upload--container.active').removeClass('active');
            $('.format--list-item-tab.active').removeClass('active');
            $('.upload--container').addClass('active');
            $('.code--output-code').empty();
          }

          if (file_extension === 'html' || file_extension == 'htm') {
            $.ajax({
              url: '/files/' + id,
              dataType: 'html',
              success: function(data) {
                var display_html = '<pre class="code--input-html-pre language-markup"><code class="base--code language-markup code--input-html-code"></code></pre>';
                $('#display_input_doc').html(display_html);
                $('.code--input-html-code').text(data);
              }
            });

            $('.sample--list-item-tab.active').removeClass('active');
            $('.upload--container.active').removeClass('active');
            $('.format--list-item-tab.active').removeClass('active');
            $('.upload--container').addClass('active');
            $('.code--output-code').empty();
          }

          $('.download--input-icon').attr('href', '/files/' + id + '?download=true&filename=' + id + '.' + file_extension);
          var top = document.getElementById('upload-your-document').offsetTop;
          window.scrollTo(0, top);

        });
      }
    },
    error: _error
  });

  function _error(xhr) {
    $('.loading').hide();
    $('.error').show();
    var response = JSON.parse(xhr.responseText);
    console.log(response.error.error);

    if (response.error.error == 500) {
      $('.error h4').text('The file is not supported, try with another file.');
    }
  }

  $('.format--list-item-tab').click(function() {
    var output_format = $(this).attr('data-attr');
    var output_type = $(this).attr('data-type');

    if (output_format === 'ANSWER_UNITS')
      $('.description--answer-unit').addClass('active');
    else
      $('.description--answer-unit.active').removeClass('active');

    $.ajax({
      url: '/convert_document/' + id + '/' + output_format,
      success: function(data) {
        if (output_type === 'json') {
          data = JSON.stringify(data, null, 2);
        }
        $('.code--output-code').text(data);
        $('.download--output-icon').attr('href', '/convert_document/' + id + '/' + output_format + '?download=true&filename=output.' + output_type);
      }
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

function convert_sample_html() {
  id = '1e163c3c-fa7e-49a0-8772-3f243d5f90b9';
  clear_file_upload();

  file_extension = 'html';

  $('.download--input-icon').attr('href', '/files/' + id + '?download=true&filename=' + id + '.' + file_extension);

  $.ajax({
    url: '/files/' + id,
    dataType: 'html',
    success: function(data) {
      var display_html = '<pre class="code--pre language-markup"><code class="base--code language-markup code--input-html-code"></code></pre>';
      $('#display_input_doc').html(display_html);
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

function convert_sample_docx() {
  id = '0e864008-ac29-4b40-b276-bf447cd9c9ed';
  clear_file_upload();

  file_extension = 'docx';

  $('.download--input-icon').attr('href', '/files/' + id + '?download=true&filename=' + id + '.' + file_extension);

  var display_word = '<iframe class="file-display--word-file" src=""></iframe>';
  $('#display_input_doc').html(display_word);
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

function convert_sample_pdf() {
  id = '332d9672-e615-4736-ad85-fe31f502994b';
  clear_file_upload();

  file_extension = 'pdf';

  $('.download--input-icon').attr('href', '/files/' + id + '?download=true&filename=' + id + '.' + file_extension);

  var display_pdf = '<div class="file-display--input-pdf-container base--textarea">' +
  '<object class="file-display--input-pdf-object" data="/files/' + id + '" type="application/pdf">' +
  '<embed class="file-display--input-pdf-embed" src="/files/' + id + '" type="application/pdf">' + '</object>' + '</div>';

  $('._content--choose-output-format.active').removeClass('active');
  $('._content--output.active').removeClass('active');
  $('._content--choose-output-format').addClass('active');
  $('#display_input_doc').html(display_pdf);
  $('.sample--list-item-tab.active').removeClass('active');
  $('.upload--container.active').removeClass('active');
  $('.format--list-item-tab.active').removeClass('active');
  $('.sample--list-item-tab:eq(2)').addClass('active');
  $('.code--output-code').empty();

  var top = document.getElementById('upload-your-document').offsetTop;
  window.scrollTo(0, top);

}

function clear_file_upload() {
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