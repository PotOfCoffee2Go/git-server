/*\
 * Check that a git-server is running for the tests
 * 
 * repo: https://github.com/PotOfCoffee2Go/git-server.git
 * author: PotOfCoffee2Go
 * license: MIT
\*/
const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

const directions = (config, configPath) => hue(`
A git-server needs to be running on repoPort `) + hue(config.repoPort,45) + hue(` for the tests.
In a separate window, from the git-server project directory; start git-server:\n`) +
hue(`npm start ${configPath}\n`,45) + 
hue(`Return here and try again.\n`);

exports.checkRepoServer = function checkRepoServer(config, configPath) {
	const { reposBase, repoUrl, repoPort, proxyPort, allowNetworkAccess, allowAnonymous, users } = config;
	config.repoUrl = `http://localhost:${config.repoPort}`;

	return new Promise((resolve, reject) => {
		const clientReq = require('node:http').get(config.repoUrl, resp => {
			let data = '';
			resp.on('data', chunk => {
				data += chunk;
			})
			resp.on('end', () => {
				if (data === 'not found') { // reply unless a git agent sent request
					resolve(0);
				} else { // port active - just is not from git-server
					console.log(`Not a git-server`);
					reject(4);
				}
			})
			resp.on('error', () => {
				console.log(directions(config, configPath));
				reject(3);
			})
		})
		clientReq.on('error', () => {
			console.log(hue(directions(config, configPath)));
			reject(2);
		})
		
	})
}
