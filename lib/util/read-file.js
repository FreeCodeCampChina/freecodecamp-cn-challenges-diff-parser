const fs = require('fs');
const path = require('path');
const filePromise = require('util').promisify(fs.readFile);

/**
 * @function readJsonFile
 * @param {String<Path>} repoPath - Local path of the repo
 * @param {Array<String>} pathArr - Path of oldFile and newFile, where oldFile comes first
 * @returns {Promise<Array<fs#readFile>>}
 */
module.exports.readJsonFile = async (repoPath, pathArr) => {
    return Promise.all([
        filePromise(path.resolve(repoPath, '../', pathArr[0]), {encoding: 'utf8'}),
        filePromise(path.resolve(repoPath, '../', pathArr[1]), {encoding: 'utf8'})
    ]);
};
