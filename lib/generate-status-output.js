const nodegit = require('nodegit');
const chalk = require('chalk');
const log = console.log;
const { getIgnore } = require('./git-helper/get-ignore');

const wtLabel = {
    WT_DELETED: chalk.bold.bgRed('Deleted'),
    WT_MODIFIED: chalk.bold.bgGreen('Modified'),
    WT_NEW: chalk.bold.bgYellowBright('New'),
    WT_RENAMED: chalk.bold.bgCyan('Renamed'),
    WT_TYPECHANGE: chalk.bold.bgBlue('Typechange'),
    WT_UNREADABLE: chalk.inverse('Unreadable')
};

module.exports.generateStatusOutput = async (repoStatus, repo) => {
    let ignoredList = await getIgnore(repo.path());
    nodegit.Ignore.addRule(repo, ignoredList);
    nodegit.Ignore.addRule(repo, '.idea/');
    log(chalk.underline.bgRedBright('Your curriculum-cn repo is not clean. Please either commit or stash your changes'));

    await repoStatus.forEach(async st => {
        if (await nodegit.Ignore.pathIsIgnored(repo, st.path()) === 0) {
            log(wtLabel[st.status()], ` ${st.path()}`)
        }
    });
};

