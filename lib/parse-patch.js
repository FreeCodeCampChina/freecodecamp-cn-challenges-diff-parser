const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const filePromise = require('util').promisify(fs.readFile);
const argv = require('minimist')(process.argv.slice(2));
const log = console.log;

const { generateLineOutput } = require('./generate-line-output');

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

/**
 * @function parsePatch
 * @desc Parse diff patch and generate output of file path and diff content (when available)
 * @param {ConvenientPatch} patch - Diff patch resolved from Diff#patches
 * @param {String<Path>} repoPath - Path to local "curriculum-cn" repository
 * @see http://www.nodegit.org/api/convenient_patch/
 * @returns {Promise<void>}
 */
module.exports.parsePatch = async (patch, repoPath) => {
    let oldFilePath = patch.oldFile().path();
    let newFilePath = patch.newFile().path();
    let jsonFile = await filePromise(path.resolve(repoPath, '../', oldFilePath), {encoding: 'utf8'});
    let jsonArray = jsonFile.split('\n');
    let hunks = await patch.hunks();
    hunks.forEach(async hunk => {
        const start = hunk.oldStart() - 1;
        const lines = await hunk.lines();
        log(generateLineOutput(jsonArray, start, oldFilePath, newFilePath, argv.type));
        lines.forEach(line => {
            let sign = String.fromCharCode(line.origin());
            if (argv.type !== 'id' && argv.type !== 'title') {
                log(outputChalk(sign)(`${sign} ${line.content().trim()}`))
            }
        });
    })
};
