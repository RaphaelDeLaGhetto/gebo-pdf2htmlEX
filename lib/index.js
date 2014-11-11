
var exec = require('child_process').exec,
    fse = require('fs-extra'),
    nconf = require('nconf'),
    utils = require('gebo-utils'),
    winston = require('winston');

// Logging stuff           
nconf.file({ file: './gebo.json' });
var logLevel = nconf.get('logLevel');
var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({ colorize: true }) ] });


/**
 * Call pdf2htmlEX to convert a PDF to HTML
 *
 * @param string
 * @param string
 * @param string
 * @param object - optional
 * @param function
 *
 * @return string
 */
function _convert(path, destDir, outFile, options, done) {

    if (typeof options === 'function') {
      done = options;
      options = {};
    }

    var outputFileName = utils.getOutputFileName(path, 'html');

    fse.mkdirs(destDir, function(err) {
        if (err) {
          if (logLevel === 'trace') logger.error('gebo-pdf2htmlex:', err);
          done(err);
        }

        var pidFile = '/tmp/' + outFile + '.pid';
        var command = 'pdf2htmlEX --dest-dir ' + destDir + ' ' + path.replace(/ /g, '\\ ') + ' ' +
                      outFile.replace(/ /g, '\\ ') + ' & echo $! > ' + pidFile;

        if (logLevel === 'trace') logger.info('gebo-pdf2htmlex:', command);

        utils.setTimeLimit(options, pidFile, function(timer) {
            exec(command, function(err, stdout, stderr) {
                utils.stopTimer(timer, options);
                if (options.timeLimit < 0) {      
                  return done('Sorry, that file took too long to process');
                }
                if (err) {
                  if (logLevel === 'trace') logger.error('gebo-pdf2htmlex:', err);
                  done(err);
                }
                else {
                  if (logLevel === 'trace' && stderr) logger.warn('gebo-pdf2htmlex:', stderr);
                  done(null, destDir + '/' + outFile);
                }
              });
          });
      });
  };
exports.convert = _convert;

