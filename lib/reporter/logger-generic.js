const chalk = require('chalk');
const log = console.log;

const debugChalk = chalk.dim.bgCyan;
const pathChalk = {
    'new': chalk.underline.blue,
    old: chalk.underline.cyan
};

/**
 * @function loggerDebug
 * @desc Debug output, output is prepended w/ a dimmed text block
 * @param {String} text - Text for output
 */
module.exports.loggerDebug = text => {
    log(debugChalk('Debug'), text);
};

/**
 * @function loggerPath
 * @desc Log path text
 * @param {String} type - File type, possible values are 'old', 'new' and 'both'
 * @param {String} text - Text for output
 */
module.exports.loggerPath = (type, text) => {
    log(pathChalk[type](text));
};

/**
 * @function loggerWarning
 * @desc Log warning text. Used for output when repo is not clean
 * @param {String} text - Text for output
 */
module.exports.loggerWarning = text => {
    log(chalk.underline.bgRedBright(text));
};
