const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const log = console.log;
const { loggerDebug, loggerPath } = require('./logger-generic');

/**
 * @function outputChalk
 * @param {String} sign - The starting symbol retrieved from DiffLine#origin
 *   - Possible values are:
 *     - Surrounded text: ' '
 *     - Line add: '+'
 *     - Line removal: '-'
 * @see http://www.nodegit.org/api/diff_line/
 * @returns {Chalk} #red for line add, #cyan for line removal, #default for the rest
 */
const outputChalk = sign => {
    if (sign === '+') {
        return chalk.red;
    } else if (sign === '-') {
        return chalk.cyan;
    } else {
        return chalk.default;
    }
};

module.exports.loggerOutput = (debug, type, diffsArr) => {
    diffsArr.forEach(diff => {
        if (argv.debug) {
            loggerDebug(`old: ${diff.oldStart}`);
            loggerDebug(`new: ${diff.newStart}`);
        }

        log(diff.output);

        diff.data.forEach(obj => {
            if (type !== 'id' && type !== 'title') {
                log(outputChalk(obj.sign)(`${obj.sign} ${obj.content.trim()}`))
            }
        });
    });
};

module.exports.loggerFile = (type, newFilePath, oldFilePath) => {
    if (type !== 'new') {
        loggerPath('old', oldFilePath);
    }
    if (type !== 'old') {
        loggerPath('new', newFilePath);
    }
};