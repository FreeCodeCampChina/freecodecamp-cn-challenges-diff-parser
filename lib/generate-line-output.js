const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const log = console.log;

const pathChalk = {
    newFile: chalk.underline.blue,
    oldFile: chalk.underline.cyan
};

/**
 * @function checkValidity
 * @desc Check if line changes are within the scope of challenges
 * @param {String} line - Code change of a single line
 * @returns {Boolean}
 */
const checkValidity = (line) => {
    if (typeof line !== 'string') return false;

    const isOutside = /^\s*"(order|time|helpRoom|challenges)":/;
    const isBoundary = /\s+{,?"$/;

    return !isOutside.test(line) && !isBoundary.test(line);
};

module.exports.generateLineOutput = (data, index, oldFilePath, newFilePath, type = 'title', prev = true) => {
    if (argv.path !== 'old') {
        log(pathChalk.newFile(newFilePath));
    }
    if (argv.path !== 'new') {
        log(pathChalk.oldFile(oldFilePath));
    }
    if (argv.debug) {
        log(data.length, index);
    }

    while (index > 0 && index <= data.length - 5 && checkValidity(data[index])) {
        if (/{\s*",?\s*$/.test(data[index])) {
            // When diff starts with {, search with index++
            prev = false;
        } else if (data[index].indexOf(`"${type}":`) > -1) {
            let matchResult = data[index].match(/^.+?:\s*"(.+)"/);
            if (matchResult !== null) {
                return data[index].match(/^.+?:\s*"(.+)"/)[1];
            }
            // Handle when title content is in new line
            return data[index + 1].trim().replace(/^"|",$/g, '');
        }
        if (prev) {
            index--;
        } else {
            index++;
        }
    }
    return 'Boundary of file';
};

