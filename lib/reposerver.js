/*\
 * Git-server repository server
 * 
 * repo: https://github.com/PotOfCoffee2Go/git-server.git
 * author: PotOfCoffee2Go
 * license: MIT
\*/
const path = require('node:path');

const { proxyServer } = require('./proxyserver');
const { eventListeners } = require('./evtlisteners');

// Color log messages
const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

// Lookup user/passwords
const auth = (users, inName, inPw) => {
	return users.find(usr => usr.name === inName && usr.password === inPw);
}

// Authenticate a user
var usersInfo, allowAnonymousPush;
const authenticate = ({ type, repo, user, headers }, next) => {
	console.log(type, repo, headers);
	if (type == 'push') {
		// anonymous push allowed?
		if (!usersInfo || allowAnonymousPush) { next(); return; }
		user((username, password) => {
			if (auth(usersInfo, username, password)) {
				next();
			} else {
				next(hue('wrong password',9));
			}
		});
	} else { // not a push - so allow all user access to git command
		next();
	}
}

// Repo server interfaces to git
exports.repoServer = function repoServer($rt) {
	return new Promise((resolve, reject) => {
		const config = $rt.context.$tw.web.config;
		const { reposBase, repoPort, proxyPort,
			allowNetworkAccess, allowAnonymous,
			users, layout } = config;

		// copy vars to module global vars
		usersInfo = users;
		allowAnonymousPush = allowAnonymous;
		
		const repoPath = path.normalize(path.resolve(reposBase));
		const { Git: Server } = require('node-git-server');
		const repos = new Server(repoPath, { authenticate, autoCreate: true });

		repos.listen( repoPort, { type: 'http' }, (error) => {
			if (error) {
				return console.error(hue(`failed to start git-server because of error ${error}`));
			}
			console.log(hue(`\nGit-server started: http://localhost:${repoPort}`));
			console.log(`Anonymous 'push' is ${allowAnonymous ? hue('allowed',10) : hue('not allowed',9)}`);
			console.log(`Access from other devices on network is ${allowNetworkAccess ? hue('allowed\n',10) : hue('not allowed\n',9)}`);
			
			proxyServer($rt);

			console.log(hue(`Repositories in directory: ${repoPath}`));
			repos.list((err, result) => {
				if (!result) {
					console.log('No repositories available...');
				} else {
					console.log(result);
				}
				eventListeners(repos, config);
				config.server.repos = repos;
				resolve(true);
			});
		});
	})
}
