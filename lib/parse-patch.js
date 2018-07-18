const fs = require('fs');
const path = require('path');
const filePromise = require('util').promisify(fs.readFile);
const { readJsonFile } = require('./util/read-file');
const log = console.log;

const extractLineDiff = lines => {
    return lines.map(line => {
        return {
            sign: String.fromCharCode(line.origin()),
            content: line.content().trim()
        }
    });
};

/**
 * @function parsePatch
 * @desc Parse diff patch and generate output of file path and diff content (when available)
 * @param {ConvenientPatch} patch - Diff patch resolved from Diff#patches
 * @param {String<Path>} repoPath - Path to local "curriculum-cn" repository
 * @see http://www.nodegit.org/api/convenient_patch/
 * @returns {Promise<Object>} - Parsed patch contains both file path, file array and diff details
 */
module.exports.parsePatch = async (patch, repoPath) => {
    let oldPath = patch.oldFile().path();
    let newPath = patch.newFile().path();
    let filesArray = await readJsonFile(repoPath, [oldPath, newPath]);
    let hunks = await patch.hunks();

    // let jsonFile = await filePromise(path.resolve(repoPath, '../', oldPath), {encoding: 'utf8'});
    // let json = jsonFile.split('\n');
    // hunks.forEach(async hunk => {
    //     const start = hunk.oldStart() - 1;
    //     const lines = await hunk.lines();
    //     log(generateLineOutput(json, start, oldPath, newPath, argv.type));
    //     lines.forEach(line => {
    //         let sign = String.fromCharCode(line.origin());
    //         if (argv.type !== 'id' && argv.type !== 'title') {
    //             log(outputChalk(sign)(`${sign} ${line.content().trim()}`))
    //         }
    //     });
    // })
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
