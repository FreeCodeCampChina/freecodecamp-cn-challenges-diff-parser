const argv = require('minimist')(process.argv.slice(2));
const { loggerFile, loggerOutput } = require('./reporter/logger-diff');

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

/**
 * @typedef {Object} ParsedDiff
 * @extends ParsedHunk
 * @see lib/parse-patch.js
 * @property {String} output - The 'title' or 'id' that a diff hunk belongs to
 */

/**
 * @function generateConsoleOutput
 * @param {DiffObject} - The DiffObject from parse-patch#parsePatch
 * @see lib/parse-patch.js
 * @returns {String} - The title, id or "Boundary of file" when index is out of range
 */
module.exports.generateConsoleOutput = (
    { oldPath, newPath, oldFile, newFile, diffs },
) => {
    loggerFile(argv.path, oldPath, newPath);

    let diffsWithOutput = diffs.map(diff => {
        let headFromOld = getHeadOutput(oldFile, diff.oldStart, argv.type);
        return Object.assign(diff, {
            output: headFromOld !== 'Boundary of file' ? headFromOld :
                getHeadOutput(newFile, diff.newStart, argv.type)
        });
    });

    loggerOutput(argv.debug, argv.type, diffsWithOutput);
};

/**
 * @function getHeadOutput
 * @desc Iterate through the JSON file passed in, searching for Title or ID
 * @param {Array<String>} data - String array from JSON file
 * @param {Number} index - Line number
 * @param {'id'|'title'|undefined} [type='title'] - Set output level, 'title' by default
 * @param {Boolean} prev=true - Flag that indicates iteration direction, `true` for backward, `false` for forward
 * @returns {String} - The title, id or "Boundary of file" when index is out of range
 */
const getHeadOutput = (
    data,
    index,
    type = 'title',
    prev = true) => {
    while (index > 0 && index <= data.length - 5 && checkValidity(data[index])) {
        if (/{\s*",?\s*$/.test(data[index])) {
            // When diff starts with {, search with index++
            prev = false;
        } else if (data[index].indexOf(`"${type}":`) > -1) {
            // Grep string within double quotes after colon
            let matchResult = data[index].match(/^.+?:\s*"(.+)"/);
            if (matchResult !== null) {
                return data[index].match(/^.+?:\s*"(.+)"/)[1];
            }
            // Handle when title content is in new line
            // Remove trailing double quotes and comma
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
