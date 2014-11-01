var nconf = require('nconf'),
    q = require('q'),
    winston = require('winston');

module.exports = function() {

    // Logging stuff           
    nconf.file({ file: './gebo.json' });
    var logLevel = nconf.get('logLevel'),
        timeout = nconf.get('pdf2htmlEX').timeout;
    var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({ colorize: true }) ] });

    /**
     * The following provides an example of the basic pattern of
     * every gebo action
     */
    exports.convert = function(verified, message) {
        var deferred = q.defer();
    
        if (verified.admin || verified.execute) {
          deferred.resolve();
        }
        else {
          deferred.reject('You are not permitted to request or propose that action');
        }
        return deferred.promise;
      };

    return exports;
};

