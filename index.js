const path = require('node:path');
const pkg = require('./package.json');
const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

const { repoServer } = require('./lib/reposerver');
const { configPath } = require('./lib/parameters').parameters();

const config = require(configPath).config();
config.repoDir = path.parse(configPath).name;
config.server = {};

if (config.layout !== 'v1') {
	console.log(hue(`Unknown configuration layout: "${layout}"`,9));
	console.log('Must be layout "v1" for git-server v${pkg.version}');
	process.exit(1);
}

console.log(`git-server v${pkg.version}`);
console.log(hue(`Configuration file: ${configPath}\n`));

process.chdir(path.dirname(configPath));
repoServer(config);
