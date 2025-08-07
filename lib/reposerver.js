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
exports.repoServer = function repoServer(config) {
	const { repoDir, repoPort, proxyPort, allowNetworkAccess, allowAnonymous, users, layout } = config;
	usersInfo = users;
	allowAnonymousPush = allowAnonymous;
	
	if (layout !== 'v1') {
		console.log(hue(`Unknown configuration layout: "${layout}"`,9));
		console.log('Must be layout "v1" for this release of git-server');
		process.exit(2);
	}

	console.log(`Anonymous 'push' is ${allowAnonymous ? hue('allowed',10) : hue('not allowed',9)}`);
	console.log(`Access from other devices on network is ${allowNetworkAccess ? hue('allowed',10) : hue('not allowed',9)}`);
	console.log('');

	const repoPath = path.normalize(path.resolve(repoDir));
	const { Git: Server } = require('node-git-server');
	const repos = new Server(repoPath, { authenticate, autoCreate: true });

	repos.listen( repoPort, { type: 'http' }, (error) => {
		if (error) {
			return console.error(hue(`failed to start git-server because of error ${error}`));
		}
		console.log(hue(`Repositories in directory: ${repoPath}`));
		console.log(hue(`git-server running at: http://localhost:${repoPort}`));
		proxyServer(proxyPort, repoPort, allowNetworkAccess);
		repos.list((err, result) => {
			if (!result) {
				console.log('No repositories available...');
			} else {
				console.log(result);
			}
			console.log(hue('(press ctrl-c to exit)',38));
		});
	});

	eventListeners(repos, config);
}
