const { getTreeDiff } = require('./get-tree-diff');

/**
 * @function getCommit
 * @desc Get the latest commit and the parent commit for comparison
 * @param {Repository} repoResponse - The repository object
 * @param {Hash} commitHash - Commit hash that includes the latest changes
 *   - Currently resolved as the latest commit from LOCAL branch dev-track-en
 * @param parentHash - Parent commit hash that is comparing to
 * @see http://www.nodegit.org/api/repository
 * @returns {Promise<getTreeDiff>}
 */
module.exports.getCommit = async (repoResponse, commitHash, parentHash) => {
    let commit = await Promise.all([repoResponse.getCommit(commitHash), repoResponse.getCommit(parentHash)])
    // let commit = await repoResponse.getCommit(commitHash);
    // let headCommit = await repoResponse.getHeadCommit();
    // let headCommit = await repoResponse.getCommit(parentHash);
    return getTreeDiff(repoResponse, commit);
};
