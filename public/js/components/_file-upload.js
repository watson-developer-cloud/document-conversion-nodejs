/*
file upload configurations
*/
(function() {
  $('#fileupload').fileupload({
    dataType: 'json',
    dropZone: $('.dropzone'),
    acceptFileTypes: /(\.|\/)(pdf|doc|docx|html)$/i,
    add: function(e, data) {
      if (data.files && data.files[0]) {
        console.log('I got the data!: ' + data.files[0].name);
        $('.upload--file-chooser-name').html(data.files[0].name);

        // var reader = new FileReader();

        // reader.onload = function() {
        // };

        // reader.readAsDataURL(data.files[0]);
        data.submit().complete(function(result, textStatus, jqXHR) {
          console.log(result, textStatus, jqXHR);
            var filename = result.responseJSON.filename;
            var file_extension = result.responseJSON.filename.split('.').pop();

            console.log('uploaded file file_extension: ' + file_extension);

            // var $input_doc_display_container = $('.file-display--input-doc-container');
            // $input_doc_display_container.html('<iframe class="file-display--word-file" src="' +
            //     'https://docs.google.com/gview?url="' +
            //     location.protocol + '://' + location.host + '/files/' + filename + '&embedded=true' +
            //     '"></iframe>');

            // var display_pdf = '<div class="file-display--input-pdf-container base--textarea">'
            //                   + '<object class="file-display--input-pdf-object" data="http://' + location.host + '/files/' + filename + '" type="application/pdf">'
            //                     + '<embed class="file-display--input-pdf-embed" src="http://' + location.host + '/files/' + filename + '" type="application/pdf">'
            //                   + '</object>'
            //                 + '</div>';

            var display_pdf = '<div class="file-display--input-pdf-container base--textarea">'
                              + '<object class="file-display--input-pdf-object" data="/files/' + filename + '" type="application/pdf">'
                                + '<embed class="file-display--input-pdf-embed" src="/files/' + filename + '" type="application/pdf">'
                              + '</object>'
                            + '</div>';

            $('#display_input_doc').html(display_pdf);
            // todo: attach me to the buttons, determine conversion target from which button was clicked
            $.post('/convert_document', {conversion_target: 'NORMALIZED_TEXT', filename: filename}, function(result, textStatus, jqXHR) {
                console.log(result, textStatus, jqXHR);

                $.ajax({
                    url : '/files/' + result.filename,
                    dataType: "text",
                    success : function (data) {
                        $('#display_output_doc').text(data);
                    }
                });
            })
        });
      }
    },
    error: _error,
    done: function(e, data) {

    }

  });

  function _error(xhr, status, error) {
    $('.loading').hide();
    $('.error').show();
    var response = JSON.parse(xhr.responseText);
    console.log(response.error.error);

    if (response.error.error == 500) {
      $('.error h4').text('The image format is not supported, try with another image.');
    }
  }

})();
