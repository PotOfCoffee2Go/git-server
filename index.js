/*\
 * Git-server entry point
 * 
 * repo: https://github.com/PotOfCoffee2Go/git-server.git
 * author: PotOfCoffee2Go
 * license: MIT
\*/
const path = require('node:path');
const pkg = require('./package.json');

const REPL = require('./lib/replprompt');
const { twdbs } = require('./lib/twdbs');
const { repoServer } = require('./lib/reposerver');

console.log(`\ngit-server v${pkg.version}`);

const { configPath } = require('./lib/parameters').parameters();
process.chdir(path.dirname(configPath));

twdbs(REPL.init())
	.then(($rt) => repoServer($rt))
	.then(() => { REPL.start(); })
