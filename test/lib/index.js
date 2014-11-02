'use strict';

var doc = require('../../lib'),
    fse = require('fs-extra');

/**
 * convert
 */
exports.convert = {

    setUp: function(callback) {
        fse.createReadStream('./test/docs/pdf.pdf').pipe(fse.createWriteStream('/tmp/pdf.pdf'));
        callback();
    },

    tearDown: function(callback) {
        fse.unlinkSync('/tmp/pdf.pdf');
        fse.removeSync('/tmp/gebo-pdf2htmlEx');
        callback();
    },

    /**
     * Timeout stuff
     */
    'Write the pdf2htmlEX PID to a file in the output directory': function(test) {
        test.expect(1);
        doc.convert('/tmp/pdf.pdf', '/tmp/gebo-pdf2htmlEX', 'my.html', function(err, path) {
            if (err) {
              test.ok(false, err);
            }
            try {
              fse.openSync('/tmp/pdf.html.pid', 'r');
              test.ok(true);
            }
            catch(err) {
              test.ok(false, err);
            }
            test.done();
          });
    },

    // How do I test this?
//    'Kill the pdf2htmlEX process if it executes longer than allowed': function(test) {
//        test.expect(2);
//        doc.convert('./test/docs/pdf.pdf', function(err, path) {
//            if (err) {
//              test.ok(false, err);
//            }
//            try {
//              fse.openSync('/tmp/pdf.html.pid', 'r');         
//              test.ok(true);
//              fse.openSync(path, 'r');         
//              test.ok(false, 'The file at the returned path shouldn\'t exist');
//            }
//            catch(err) {
//              test.ok(true);
//            }
//            test.done();
//          });
//    },

    'Convert a PDF to HTML': function(test) {
        test.expect(2);
        doc.convert('/tmp/pdf.pdf', '/tmp/gebo-pdf2htmlEX', 'my.html',function(err, path) {
            if (err) {
              test.ok(false, err);
            }
            test.equal(path, '/tmp/gebo-pdf2htmlEX/my.html');
            try {
              fse.closeSync(fse.openSync(path, 'r'));
              test.ok(true);
            }
            catch (err) {
              test.ok(false, err);
            }
            test.done();
          });
    },
};


/**
 * getOutputFileName
 */
exports.getOutputFileName = {

    'Change the file extension to that specified': function(test) {
        test.expect(2);
        var filename = doc.getOutputFileName('/tmp/gebo-libreoffice/doc.doc', 'pdf');        
        test.equal(filename, 'doc.pdf');
        filename = doc.getOutputFileName('pdf.pdf', 'docx');        
        test.equal(filename, 'pdf.docx');
        test.done();
    },

    'Change the file extension to that specified on an infile with no extension': function(test) {
        test.expect(2);
        var filename = doc.getOutputFileName('/tmp/gebo-libreoffice/doc', 'pdf');        
        test.equal(filename, 'doc.pdf');
        filename = doc.getOutputFileName('pdf.pdf', 'docx');
        test.equal(filename, 'pdf.docx');
        test.done();
    },

    'Change the file extension to that specified on hidden file with no extension': function(test) {
        test.expect(2);
        var filename = doc.getOutputFileName('/tmp/gebo-libreoffice/.hidden', 'pdf');        
        test.equal(filename, '.hidden.pdf');
        filename = doc.getOutputFileName('.hidden', 'docx');        
        test.equal(filename, '.hidden.docx');
        test.done();
    },

    'Change the file extension to that specified on a hidden file with an extension': function(test) {
        test.expect(2);
        var filename = doc.getOutputFileName('/tmp/gebo-libreoffice/.hidden.rtf', 'pdf');        
        test.equal(filename, '.hidden.pdf');
        filename = doc.getOutputFileName('.hidden.pdf', 'docx');        
        test.equal(filename, '.hidden.docx');
        test.done();
    },

    'Should overwrite any unusual extensions': function(test) {
        test.expect(2);
        var filename = doc.getOutputFileName('/tmp/gebo-libreoffice/somefile.someweirdextension', 'rtf');        
        test.equal(filename, 'somefile.rtf');
        filename = doc.getOutputFileName('somefile.someweirdextension', 'docx');        
        test.equal(filename, 'somefile.docx');
        test.done();
    },
};
