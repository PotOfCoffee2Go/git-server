/*\
 * Git-server parameters - currently is config file path
 * 
 * repo: https://github.com/PotOfCoffee2Go/git-server.git
 * author: PotOfCoffee2Go
 * license: MIT
\*/
const fs = require('node:fs');
const path = require('node:path');
const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

exports.parameters = function parameters() {

	var configModule = process.argv[2] || './repos.js';
	if (!/\.js$/.test(configModule)) {
		configModule = configModule + '.js';
	}

	const configPath = path.normalize(path.resolve(configModule));

	if (!fs.existsSync(configPath)) {
		console.log(hue(`Conguration file ${configPath} not found`,9));
		process.exit(2);
	}

	return { configPath };
}
