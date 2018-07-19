const { readJsonFile } = require('./util/read-file');

/**
 * @typedef {Object} DiffContent
 * @property {String} sign - Possible values are ' ', '+' or '-',
 *   where ' ' denotes unchanged line of code, '+' denotes code addition and '-' denotes code subtraction
 * @property {String} content - Line diff
 */

/**
 * @function extractLineDiff
 * @param {ConvenientHunk} lines - Detailed diff data from ConvenientPath#hunks
 * @returns {Array<DiffContent>} Actual code diff from lines
 */
const extractLineDiff = lines => {
    return lines.map(line => {
        return {
            sign: String.fromCharCode(line.origin()),
            content: line.content().trim()
        }
    });
};

/**
 * @typedef {Object} ParsedHunk
 * @property {Number} oldStart - Line number of the old file where diff exists
 * @property {Number} newStart - Line number of the new file where diff exists
 * @property {Array<DiffContent>} data - The actual code diff
 */

/**
 * @typedef {Object} DiffObject
 * @property {String<Path>} oldPath - Path of old file regarding to the diff
 * @property {String<Path>} newPath - Path of new file regarding to the diff, normally identical to oldPath
 * @property {Array<String>} oldFile - The old JSON file split to array by new line character
 * @property {Array<String>} newFile - The new JSON file split to array by new line character
 * @property {Array<ParsedHunk>} diffs - Array that contains all parsed diff content
 */

/**
 * @function parsePatch
 * @desc Parse diff patch and generate output of file path and diff content (when available)
 * @param {ConvenientPatch} patch - Diff patch resolved from Diff#patches
 * @param {String<Path>} repoPath - Path to local "curriculum-cn" repository
 * @see http://www.nodegit.org/api/convenient_patch/
 * @returns {DiffObject} - Parsed patch contains both file path, file array and diff details
 */
module.exports.parsePatch = async (patch, repoPath) => {
    let oldPath = patch.oldFile().path();
    let newPath = patch.newFile().path();
    let filesArray = await readJsonFile(repoPath, [oldPath, newPath]);
    let hunks = await patch.hunks();

    let hunksResult = await Promise.all(hunks.map(async hunk => {
        const oldStart = hunk.oldStart() - 1;
        const newStart = hunk.newStart() - 1;
        const lines = extractLineDiff(await hunk.lines());
        return {
            oldStart,
            newStart,
            data: lines
        }
    }));

    return {
        oldPath,
        newPath,
        oldFile: filesArray[0].split('\n'),
        newFile: filesArray[1].split('\n'),
        diffs: hunksResult
    };
};
