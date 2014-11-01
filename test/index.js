'use strict';

var actionModule = require('..');

/**
 * convert
 */
exports.convert = {

    setUp: function(callback) {
        callback();
    },

    tearDown: function(callback) {
        callback();
    },

    'Reject an agent with inadequate permission': function(test) {
        test.expect(1);
        actionModule.actions.convert({ resource: 'convert' }, {}).
            then(function(greeting) {
                test.ok(false, 'Shouldn\'t get here');
                test.done();
              }).
            catch(function(err) {
                test.equal(err, 'You are not permitted to request or propose that action');
                test.done();
              });
    },

    'Return a greeting to an agent with execute permission': function(test) {
        test.expect(1);
        actionModule.actions.convert({ resource: 'convert', execute: true }, {}).
            then(function(greeting) {
                test.ok(true);
                test.done();
              }).
            catch(function(err) {
                test.ok(false, err);      
                test.done();
              });
    },


};
