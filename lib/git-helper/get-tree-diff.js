const { isChallengePath } = require('../util/is-challenge-path');
const { parsePatch } = require('../parse-patch');
const { generateConsoleOutput } = require('../generate-line-output');

/**
 * @function getTreeDiff
 * @desc Get tree diff based on two commits
 * @param {Repository} repoResponse
 * @param {Array<Commit>} commits - Array of latest commit and parent commit
 * @see http://www.nodegit.org/api/repository
 * @see http://www.nodegit.org/api/commit/#getTree
 * @returns void
 */
module.exports.getTreeDiff = async (repoResponse, commits) => {
    let commitTree = await commits[0].getTree();
    let parentTree = await commits[1].getTree();
    let treeDiffs = await commitTree.diff(parentTree);
    let patches = await treeDiffs.patches();
    let challengePatches = patches.filter(isChallengePath);

    challengePatches.forEach(async patch => {
        let patchObj = await parsePatch(patch, repoResponse.path());
        // TODO: Handle template output
        generateConsoleOutput(patchObj)
    });
};
