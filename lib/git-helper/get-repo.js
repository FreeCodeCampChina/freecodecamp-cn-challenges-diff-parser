const nodegit = require('nodegit');
const { getCommit } = require('./get-commit');
const { generateStatusOutput } = require('../../process/generate-status-output');

/**
 * @function getRepo
 * @desc Open repository
 *   - If there are local changes, call generateStatusOutput instead of getCommit
 * @param {String<Path>} path - Local path to the repository
 * @returns {generateStatusOutput|Promise<getCommit>}
 */
module.exports.getRepo = async (path) => {
    let repoResponse = await nodegit.Repository.open(path);
    let status = await repoResponse.getStatus();

    if (status.length > 0) {
        return generateStatusOutput(status, repoResponse)
    } else {
        let latestCommit = await repoResponse.getBranchCommit('dev-track-en');
        // Compare diff
        // TODO: Retrieve tagged commit from latest tag
        // return await getCommit(repoResponse, 'd951bf951ac6c541d9625ca9d0b1d34ad2b2eb25', latestCommit);
        return await getCommit(repoResponse, latestCommit, '15675e8b42204fa2d16e4669659d07fc38f2916e');
    }
};

