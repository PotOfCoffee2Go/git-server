/*\
 * Git-server entry point
 * 
 * repo: https://github.com/PotOfCoffee2Go/git-server.git
 * author: PotOfCoffee2Go
 * license: MIT
\*/
const path = require('node:path');

const { twdbs } = require('./lib/twdbs');


const { configPath } = require('./lib/parameters').parameters();
const { loadConfig } = require('./lib/loadconfig');
const { repoServer } = require('./lib/reposerver');

const config = loadConfig(configPath);
process.chdir(path.dirname(configPath));
twdbs(config)
	.then(() => repoServer(config));
