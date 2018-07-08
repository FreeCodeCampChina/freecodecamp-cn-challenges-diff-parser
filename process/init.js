const path = require('path');
const { getRepoPath } = require('../lib/git-helper/get-repo-path');
const { getRepo } = require('../lib/git-helper/get-repo');

/**
 * @function init
 * @desc The method called within index.js, initializing application
 * @param {String} dirName - The __dirname retrieved based off index.js
 * @returns {Promise<getRepo>}
 */
module.exports.init = async (dirName) => {
    let challengesPath = await getRepoPath(dirName);
    return getRepo(path.resolve(challengesPath, './.git'));
};
