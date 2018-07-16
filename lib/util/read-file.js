const fs = require('fs');
const path = require('path');
const filePromise = require('util').promisify(fs.readFile);

module.exports.readJsonFile = async (repoPath, pathArr) => {
    return Promise.all([
        filePromise(path.resolve(repoPath, '../', pathArr[0]), {encoding: 'utf8'}),
        filePromise(path.resolve(repoPath, '../', pathArr[1]), {encoding: 'utf8'})
    ]);
}
