
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
 * @param object
 * @param function
 *
 * @return string
 */
function _convert(path, destDir, outFile, options, done) {

    var outputFileName = utils.getOutputFileName(path, 'html');

    // Escape wonky characters
    var cleanPath = path.replace(/ /g, '\\ ');
    cleanPath = cleanPath.replace(/\(/g, '\\(');
    cleanPath = cleanPath.replace(/\)/g, '\\)');

    var cleanOutFile = outFile.replace(/ /g, '\\ ');
    cleanOutFile = cleanOutFile.replace(/\(/g, '\\(');
    cleanOutFile = cleanOutFile.replace(/\)/g, '\\)');

    fse.mkdirs(destDir, function(err) {
        if (err) {
          if (logLevel === 'trace') logger.error('gebo-pdf2htmlex:', err);
          done(err);
        }

        var range = '';
        if (options.first) {
          range = '-f ' + options.first;
        }

        if (options.last) {
          range += ' -l ' + options.last;
        }

        var command = 'pdf2htmlEX ' + range + ' --dest-dir ' + destDir + ' ' + cleanPath + ' ' +
                      cleanOutFile + utils.echoPidToFile(options);

        if (logLevel === 'trace') logger.info('gebo-pdf2htmlex:', command);

        exec(command, function(err, stdout, stderr) {
            if (options.returnNow) {      
              return done(options.returnNow);
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
  };
exports.convert = _convert;

