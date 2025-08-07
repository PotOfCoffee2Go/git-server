const path = require('node:path');

const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

const pkg = require('./package.json');

const { configPath } = require('./lib/parameters').parameters();
const config = require(configPath).config();

if (config.layout !== 'v1') {
	console.log(hue(`Unknown configuration layout: "${layout}"`,9));
	console.log('Must be layout "v1" for git-server v${pkg.version}');
	process.exit(1);
}

config.repoDir = path.parse(configPath).name;
config.server = {};
 
const { repoServer } = require('./lib/reposerver');

process.chdir(path.dirname(configPath));

console.log(`git-server v${pkg.version}`);
console.log(hue(`Configuration file: ${configPath}\n`));
repoServer(config);
