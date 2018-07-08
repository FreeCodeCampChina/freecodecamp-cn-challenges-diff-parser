const util = require('util');
const fs = require('fs');
const filePromise = util.promisify(fs.readFile);
const path = require('path');

/**
 * @function getIgnore
 * @desc Retrieve .gitignore file from current repository
 * @param {Repository#path} repoPath - Local path to the repository
 * @returns {Promise<filePromise>}
 */
module.exports.getIgnore = async (repoPath) => {
    return await filePromise(path.resolve(repoPath, '../.gitignore'), {encoding: 'utf8'});
};
