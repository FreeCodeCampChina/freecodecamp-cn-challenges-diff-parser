/**
 * @function isChallengePath
 * @desc Check if diff patch path is in challenges folder, and if it is json file
 * @param {Diff#patches} patch - Patch of diff
 * @see http://www.nodegit.org/api/diff/#patches
 * @see http://www.nodegit.org/api/convenient_patch/#newFile
 * @see http://www.nodegit.org/api/diff_file/#path
 * @returns {boolean}
 */
module.exports.isChallengePath = (patch) => {
    // Check if path starts with "challenges/" (i.e. within challenges folder) and ends with ".json" (i.e. json file)
    const pathRegex = /^challenges\/.*\.json$/;
    return pathRegex.test(patch.oldFile().path()) && pathRegex.test(patch.newFile().path());
};
