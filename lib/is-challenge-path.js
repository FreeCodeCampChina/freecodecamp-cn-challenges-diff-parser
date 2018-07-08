module.exports.isChallengePath = (patch) => {
    const pathRegex = /^challenges\/.*\.json$/;
    return pathRegex.test(patch.oldFile().path()) && pathRegex.test(patch.newFile().path());
};
