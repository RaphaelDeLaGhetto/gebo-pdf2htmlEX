'use strict';

var actionModule = require('..'),
    fse = require('fs-extra'),
    nconf = require('nconf');

var DOMAIN = nconf.get('domain');

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
        callback();
    },

    'Reject an agent with inadequate permission': function(test) {
        test.expect(1);
        actionModule.actions.convert({ resource: 'convert' }, {}).
            then(function(page) {
                test.ok(false, 'Shouldn\'t get here');
                test.done();
              }).
            catch(function(err) {
                test.equal(err, 'You are not permitted to request or propose that action');
                test.done();
              });
    },

    'Convert PDF to HTML and return raw data': function(test) {
        test.expect(3);
        actionModule.actions.convert({ resource: 'convert', execute: true },
                                     { content: { raw: true },
                                       file: {
                                            path: '/tmp/pdf.pdf',
                                            originalname: 'my.pdf',
                                            type: 'application/pdf',
                                            size: 19037,
                                       },
              }).
            then(function(page) {
                test.equal(page.filePath, fse.realpathSync('./public/pdf.pdf/my.html'));
                test.equal(page.fileName, 'my.html');
                try {
                  fse.closeSync(fse.openSync(page.filePath, 'r'));
                  fse.removeSync('./public/pdf.pdf');
                  test.ok(true);
                }
                catch (err) {
                  test.ok(false, err);
                }
                test.done();
              }).
            catch(function(err) {
                test.ok(false, err);      
                test.done();
              });
    },

    'Convert PDF to HTML and return a link': function(test) {
        test.expect(2);
        actionModule.actions.convert({ resource: 'convert', execute: true },
                                     { file: {
                                            path: '/tmp/pdf.pdf',
                                            originalname: 'my.pdf',
                                            type: 'application/pdf',
                                            size: 19037,
                                       },
              }).
            then(function(link) {
                test.equal(link, DOMAIN + '/pdf.pdf/my.html');
                try {
                  fse.removeSync('./public/pdf.pdf');
                  test.ok(true);
                }
                catch (err) {
                  test.ok(false, err);
                }
                test.done();
              }).
            catch(function(err) {
                test.ok(false, err);      
                test.done();
              });
    },
};
