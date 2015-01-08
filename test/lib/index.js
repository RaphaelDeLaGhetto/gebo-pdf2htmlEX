'use strict';

var doc = require('../../lib'),
    fs = require('fs-extra'),
    utils = require('gebo-utils');

/**
 * convert
 */
exports.convert = {

    setUp: function(callback) {
        fs.createReadStream('./test/docs/pdf.pdf').pipe(fs.createWriteStream('/tmp/pdf.pdf'));
        fs.createReadStream('./test/docs/pdf.pdf').pipe(fs.createWriteStream('/tmp/My Inconveniently named PDF.pdf'));
        fs.createReadStream('./test/docs/pdf.pdf').pipe(fs.createWriteStream('/tmp/My Inconveniently named PDF(1).pdf'));
        callback();
    },

    tearDown: function(callback) {
        fs.unlinkSync('/tmp/pdf.pdf');
        fs.unlinkSync('/tmp/My Inconveniently named PDF.pdf');
        fs.unlinkSync('/tmp/My Inconveniently named PDF(1).pdf');
        fs.removeSync('/tmp/gebo-pdf2htmlEx');
        callback();
    },

    /**
     * Timeout stuff
     */
    'Write the pdf2htmlEX PID to a file in the output directory': function(test) {
        test.expect(1);
        doc.convert('/tmp/pdf.pdf', '/tmp/gebo-pdf2htmlEX', 'my.html', { pidFile: '/tmp/file.pid' }, function(err, path) {
            if (err) {
              test.ok(false, err);
            }
            try {
              fs.openSync('/tmp/file.pid', 'r');
              test.ok(true);
            }
            catch(err) {
              test.ok(false, err);
            }
            test.done();
          });
    },

    // This doesn't actually time out. The option is set by the gebo-server
    'Return error if option.returnNow is set to true': function(test) {
        test.expect(1);
        var options = { pidFile: '/tmp/file.pid', timeLimit: 50, returnNow: 'Sorry, that file took too long to process' };
        doc.convert('/tmp/pdf.pdf', '/tmp/gebo-pdf2htmlEX', 'my.html', options, function(err, path) {
            test.ok(err, 'Sorry, that file took too long to process');
            test.done();
          });
    },

    'Kill the pdf2htmlEX process if it executes longer than allowed': function(test) {
        test.expect(1);
        var options = { pidFile: '/tmp/file.pid', timeLimit: 50 };
        utils.setTimeLimit(options, function(timer) {
            doc.convert('/tmp/pdf.pdf', '/tmp/gebo-pdf2htmlEX', 'my.html', options, function(err, path) {
                if (err) {
                  test.equal(err, 'Sorry, that file took too long to process');
                }
                else {
                  test.ok(false, 'This should have returned an error');
                }
                test.done();
              });
          });
    },

    'Convert a PDF to HTML': function(test) {
        test.expect(2);
        doc.convert('/tmp/pdf.pdf', '/tmp/gebo-pdf2htmlEX', 'my.html', { pidFile: '/tmp/file.pid' }, function(err, path) {
            if (err) {
              test.ok(false, err);
            }
            test.equal(path, '/tmp/gebo-pdf2htmlEX/my.html');
            try {
              fs.closeSync(fs.openSync(path, 'r'));
              test.ok(true);
            }
            catch (err) {
              test.ok(false, err);
            }
            test.done();
          });
    },

    'Convert a PDF with spaces in the filename to HTML': function(test) {
        test.expect(2);
        doc.convert('/tmp/My Inconveniently named PDF.pdf', '/tmp/gebo-pdf2htmlEX', 'My Inconveniently named PDF.html', { pidFile: '/tmp/file.pid' }, function(err, path) {
            if (err) {
              test.ok(false, err);
            }
            test.equal(path, '/tmp/gebo-pdf2htmlEX/My Inconveniently named PDF.html');
            try {
              fs.closeSync(fs.openSync(path, 'r'));
              test.ok(true);
            }
            catch (err) {
              test.ok(false, err);
            }
            test.done();
          });
    },

    'Convert a PDF with spaces and brackets in the filename to HTML': function(test) {
        test.expect(2);
        doc.convert('/tmp/My Inconveniently named PDF(1).pdf', '/tmp/gebo-pdf2htmlEX', 'My Inconveniently named PDF(1).html',
                    { pidFile: '/tmp/file.pid' }, function(err, path) {
            if (err) {
              test.ok(false, err);
            }
            test.equal(path, '/tmp/gebo-pdf2htmlEX/My Inconveniently named PDF(1).html');
            try {
              fs.closeSync(fs.openSync(path, 'r'));
              test.ok(true);
            }
            catch (err) {
              test.ok(false, err);
            }
            test.done();
          });
    },

    'Convert a single page to HTML': function(test) {
        console.log('TODO');
        test.done();
    },

    'Convert a range of pages to HTML': function(test) {
        console.log('TODO');
        test.done();
    },

    'Don\'t barf if the selected range is out of range': function(test) {
        console.log('TODO');
        test.done();
    },

    'Don\'t barf if first page selected is negative': function(test) {
        console.log('TODO');
        test.done();
    },
};

