
var exec = require('child_process').exec,
    fse = require('fs-extra'),
    nconf = require('nconf'),
    winston = require('winston');

// Logging stuff           
nconf.file({ file: './gebo.json' });
var logLevel = nconf.get('logLevel'),
    timeout = nconf.get('pdf2htmlex').timeout;
var logger = new (winston.Logger)({ transports: [ new (winston.transports.Console)({ colorize: true }) ] });


/**
 * Call pdf2htmlEX to convert a PDF to HTML
 *
 * @param string
 * @param function
 *
 * @return string
 */
function _convert(path, destDir, outFile, done) {

    var outputFileName = _getOutputFileName(path, 'html');

    // Set up time limit
    var executionTimer = setTimeout(function() {
          var kill = 'kill $(cat /tmp/' + _getOutputFileName(path, 'html') + '.pid)';
          exec(kill, function(err, stdout, stderr) {
                done('Sorry, that file took too long to process');
            });
        }, timeout);

    fse.mkdirs(destDir, function(err) {
        if (err) {
          if (logLevel === 'trace') logger.error('gebo-pdf2htmlex:', err);
          done(err);
        }

        var command = 'pdf2htmlEX --dest-dir ' + destDir + ' ' + path.replace(/ /g, '\\ ') + ' ' +
                      outFile.replace(/ /g, '\\ ') + ' & echo $! > /tmp/' + outFile + '.pid';

        if (logLevel === 'trace') logger.info('gebo-pdf2htmlex:', command);
        exec(command, function(err, stdout, stderr) {
              clearTimeout(executionTimer);
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


/**
 * Take the incoming filename and its extension
 * and return the hypothetical output filename
 *
 * @param string
 * @param string
 *
 * @return string
 */
function _getOutputFileName(path, extension) {
    var filename = path.split('/');
    filename = filename[filename.length - 1];
    filename = filename.split('.');

    // No extension found
    if (filename.length === 1) {
      return filename[0] + '.' + extension;
    }

    // Hidden file
    if (filename[0] === '') {
      filename = filename.slice(1);
      filename[0] = '.' + filename[0];
      if (filename.length === 1) {
        return filename[0] + '.' + extension;
      }
    }

    filename = filename.slice(0, -1);
                              
    return filename + '.' + extension;
  };
exports.getOutputFileName = _getOutputFileName;


