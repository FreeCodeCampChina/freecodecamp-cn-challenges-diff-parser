const fs = require('fs');
const path = require('path');
const { askForProjectPath } = require('../../process/ask-for-path');

/**
 * @function getRepoPath
 * @desc Calculate the path to "curriculum-cn"
 *   - When path cannot be determined, call inquirer#prompt and ask for user input
 * @param {String<__dirname>} directory - The __dirname based off index.js
 * @returns {String<Path>}
 */
module.exports.getRepoPath = async (directory) => {
    if (/curriculum-cn$/.test(process.cwd())) {
        return process.cwd();
    } else {
        // Running local, dev mode
        if (/freecodecamp-cn-challenges-diff-parser$/.test(directory)) {
            // Local setup - S1ngS1ng
            if (fs.existsSync(path.resolve(directory, '../cn/curriculum-cn'))) {
                return path.resolve(directory, '../cn/curriculum-cn');
            } else if (fs.existsSync(path.resolve(directory, '../curriculum-cn'))) {
                // FIXME: Attempt, verify if is valid scenario
                return path.resolve(directory, '../curriculum-cn');
            }
        }
        let { challengePath } = await askForProjectPath();
        return challengePath;
    }
};
