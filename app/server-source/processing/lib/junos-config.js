const fs = require('fs');

function stat() {
    fs.stat('/Users/paul/Documents/development/vscode/modern-web/config-files/sample-config.json', (err, stats) => {
    if (err) throw err;
        console.log(`stats: ${JSON.stringify(stats)}`);
    });
}

function processConfigFile(callback) {
    fs.readFile('./config-files/sample-config.json', 'utf8', (err, data) => {
        if (err) throw err;
        var config = JSON.parse(data)['config-template'];

        callback(config);
    });
}

export {stat, processConfigFile};