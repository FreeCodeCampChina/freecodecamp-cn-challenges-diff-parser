const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const filePromise = require('util').promisify(fs.readFile);
const argv = require('minimist')(process.argv.slice(2));
const log = console.log;

const { generateLineOutput } = require('./generate-line-output');

const outputChalk = sign => {
    if (sign === '+') {
        return chalk.red;
    } else if (sign === '-') {
        return chalk.cyan;
    } else {
        return chalk.default;
    }
};

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
