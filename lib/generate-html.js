const fse = require('fs-extra');
const path = require('path');
const { promisify } = require('util');
const ejsRenderFile = promisify(require('ejs').renderFile);
const globPromise = promisify(require('glob'));

const destFolder = './public';

// Clean destination folder
fse.emptyDirSync(destFolder);

// Copy Assets
// TODO

const config = {
    site: {
        title: 'freeCodeCamp Diff Parser',
        description: 'Generate ID or Title output from diff'
    }
};

const loadFiles = async () => {
    let templates = await globPromise('**/*.ejs', { cwd: './pages'});
    templates.forEach(template => {
        const fileData = path.parse(template);
        const destPath = path.join(destFolder, fileData.dir);

        fse.mkdirs(destPath)
            .then(() => {
                return ejsRenderFile(`./pages/${template}`, Object.assign({}, config, {
                    body: 'Test body'
                }));
            })
            // .then(pageContents => {
            //     return ejsRenderFile('./pages/index.ejs', Object.assign({}, config, {
            //         body: pageContents
            //     }))
            // })
            .then(layoutContent => {
                console.log(`${destPath}/${fileData.name}.html`)
                console.log(layoutContent)
                fse.writeFile(`${destPath}/${fileData.name}.html`, layoutContent)
            })
    });
};

loadFiles()
