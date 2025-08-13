/*\
 * Git-server load configuration
 * 
 * repo: https://github.com/PotOfCoffee2Go/git-server.git
 * author: PotOfCoffee2Go
 * license: MIT
\*/
const path = require('node:path');
const pkg = require('../package.json');
const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

exports.loadConfig = function loadConfig(configPath) {
	const config = require(configPath).config();
	config.pkgDir = process.cwd();
	config.reposBase = path.parse(configPath).name;
	config.server = {};

	if (config.layout !== 'v1') {
		console.log(hue(`Unknown configuration layout: "${layout}"`,9));
		console.log('Must be layout "v1" for git-server v${pkg.version}');
		process.exit(1);
	}

	console.log(`\ngit-server v${pkg.version}`);
	console.log(hue(`Configuration file: ${configPath}`));
	console.log(hue(`Git server: http://localhost:${config.repoPort}`));

	return config;
}
