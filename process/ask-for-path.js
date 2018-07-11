const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

/**
 * @function askForProjectPath
 * @desc Call inquirer#prompt, ask user for input of local "curriculum-cn" repository path
 * @returns {Promise<inquirer>} - User input will be available upon promise resolve
 */
module.exports.askForProjectPath = async () => {
    return await inquirer.prompt({
        name: 'challengePath',
        type: 'input',
        message: 'Curriculum-cn repo not found.\nPlease Enter the path to your local curriculum-cn\n',
        validate(value) {
            if (fs.existsSync(path.resolve(value))) {
                return true;
            } else {
                return 'Please enter a valid path'
            }
        }
    });
};
