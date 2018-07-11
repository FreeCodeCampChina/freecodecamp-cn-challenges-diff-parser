const chalk = require('chalk');
const log = console.log;

const wtLabel = {
    WT_DELETED: chalk.bold.bgRed('Deleted'),
    WT_MODIFIED: chalk.bold.bgGreen('Modified'),
    WT_NEW: chalk.bold.bgYellowBright('New'),
    WT_RENAMED: chalk.bold.bgCyan('Renamed'),
    WT_TYPECHANGE: chalk.bold.bgBlue('Typechange'),
    WT_UNREADABLE: chalk.inverse('Unreadable')
};

/**
 * @function loggerWarning
 * @desc Log warning text. Used for output when repo is not clean
 * @param {String} text - Text for output
 */
module.exports.loggerWarning = text => {
    log(chalk.underline.bgRedBright(text));
};

/**
 * @function loggerStatus
 * @desc Log file change status type and path. Used for output when repo is not clean
 * @param {StatusFile#status} status - File change status type, possible values are:
 *   WT_DELETED, WT_MODIFIED, WT_NEW, WT_RENAMED, WT_TYPECHANGE, WT_UNREADABLE
 * @param {StatusFile#path} path - File change status path
 * @see https://github.com/nodegit/nodegit/blob/master/lib/status_file.js
 */
module.exports.loggerStatus = (status, path) => {
    log(wtLabel[status], ` ${path}`);
};
