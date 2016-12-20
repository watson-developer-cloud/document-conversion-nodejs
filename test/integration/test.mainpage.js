/* eslint no-undef: 0 */
/* eslint prefer-arrow-callback: 0 */
casper.test.begin('Document Conversion Demo', 31, function suite(test) {
  const baseHost = 'http://localhost:3000';

  function testButtonExists() {
    test.assertExists('label[for="source-sampleHTML.html"]', 'Sample html - button is found');
    test.assertExists('label[for="source-sampleWORD.docx"]', 'Sample docx - button is found');
    test.assertExists('label[for="source-samplePDF.pdf"]', 'Sample pdf - button is found');
    test.assertExists('label[for="source-custom"]', 'Upload a file - button is found');
  }

  function testOutputSection() {
    // Brings up Choose an output format - check for 3 new buttons
    casper.waitForSelector('div._content--choose-output-format', function () {
      test.assertExists('label[for="destination-json"]', 'Answer units JSON - button is found');
      test.assertExists('label[for="destination-html"]', 'Normlized HTML - button is found');
      test.assertExists('label[for="destination-text"]', 'Plain text - button is found');
    });
  }

  function testHtmlButtonClick() {
    casper.then(function () {
      this.click('label[for="source-sampleHTML.html"]');
    });

    testOutputSection();
  }

  function testDocxButtonClick() {
    casper.then(function () {
      this.click('label[for="source-sampleWORD.docx"]');
    });

    testOutputSection();
  }

  function testPdfButtonClick() {
    casper.then(function () {
      this.click('label[for="source-samplePDF.pdf"]');
    });

    testOutputSection();
  }

  function testUploadButtonClick() {
    casper.then(function () {
      this.click('label[for="source-custom"]');
    });

    casper.then(function () {
      casper.waitForSelector('label[for="file-chooser-input"]', function () {
        test.assertExists('label[for="file-chooser-input"]', 'Choose your file - button is found');
      });
    });
  }

  function checkLinkDest(starturl, selectorToClick) {
    casper.thenOpen(starturl, function () { });
    casper.then(function () { this.click(selectorToClick); });
    test.assertHttpStatus(200);
  }

  function testHeaderLinks() {
    checkLinkDest(baseHost, 'nav.jumbotron--nav h5:nth-child(1)');
    checkLinkDest(baseHost, 'nav.jumbotron--nav li:nth-child(1)');
    checkLinkDest(baseHost, 'nav.jumbotron--nav li:nth-child(2)');
    checkLinkDest(baseHost, 'nav.jumbotron--nav li:nth-child(3)');
  }

  function testDocumentSection() {
    // Brings up Document section - Your document and Output document
    casper.waitForSelector('div._content--output', function () {
      test.assertExists('div[class="tab-panels"]', 'The tab panel is found');
      test.assertExists('a[class="active tab-panels--tab base--a"]', 'Your document - is found');
      test.assertExists('a[class=" tab-panels--tab base--a"]', 'Output document - is found');
    });
  }

  function testOutputFormatButtonsClick() {
    casper.then(function () {
      this.click('label[for="destination-json"]');
    });

    testDocumentSection();

    casper.then(function () {
      this.click('label[for="destination-html"]');
    });

    testDocumentSection();

    casper.then(function () {
      this.click('label[for="destination-text"]');
    });

    testDocumentSection();

    // Your document
    casper.then(function () {
      this.click('ul.tab-panels--tab-list li:nth-child(1)');
    });
    test.assertHttpStatus(200);

    // Output document
    casper.then(function () {
      this.click('ul.tab-panels--tab-list li:nth-child(2)');
    });
    test.assertHttpStatus(200);
  }

  casper.start(baseHost, function (result) {
    test.assert(result.status === 200, 'Front page opens');
    test.assertEquals(this.getTitle(), 'Document Conversion Demo', 'Title is found');

    testButtonExists();
    testHtmlButtonClick();
    testDocxButtonClick();
    testPdfButtonClick();
    testUploadButtonClick();
    testHeaderLinks();
    testOutputFormatButtonsClick();
  });

  casper.run(function () {
    test.done();
  });
});
