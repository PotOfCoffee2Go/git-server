const path = require('node:path');

const { proxyServer } = require('./proxyserver');

// Color log messages
const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

// Lookup user/passwords
const auth = (users, inName, inPw) => {
	return users.find(usr => usr.name === inName && usr.password === inPw);
}

// Authenticate a user
const authenticate = ({ type, repo, user, headers }, next) => {
	console.log(type, repo, headers);
	if (type == 'push') {
		// anonymous push allowed?
		if (!users || allowAnonymousPush) { next(); return; }
		user((username, password) => {
			if (auth(users, username, password)) {
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
	const { repoDir, port, proxyport, allowNetworkAccess, allowAnonymousPush, users } = config;

	console.log(`Anonymous 'push' is ${allowAnonymousPush ? hue('allowed',10) : hue('not allowed',9)}`);
	console.log(`Access from other devices on network is ${allowNetworkAccess ? hue('allowed',10) : hue('not allowed',9)}`);
	console.log('');

	const repoPath = path.normalize(path.resolve(repoDir));
	const { Git: Server } = require('node-git-server');
	const repos = new Server(repoPath, { authenticate, autoCreate: true });

	repos.listen( port, { type: 'http' }, (error) => {
		if (error) {
			return console.error(hue(`failed to start git-server because of error ${error}`));
		}
		console.log(hue(`Repositories in directory: ${repoPath}`));
		console.log(hue(`git-server running at http://localhost:${port}`));
		proxyServer(proxyport, port, allowNetworkAccess);
		repos.list((err, result) => {
			if (!result) {
				console.log('No repositories available...');
			} else {
				console.log(result);
			}
			console.log(hue('(press ctrl-C to exit)',38));
		});
	});

	// --------------------------------
	// Examples of git command event listeners
	repos.on('push', (push) => {
		console.log(`push ${push.repo} / ${push.commit} ( ${push.branch} )`);
		repos.list((err, results) => {
			push.log(' ');
			push.log('Hey!');
			push.log('Checkout these other repos:');
			for (const repo of results) {
				push.log(`- ${repo}`);
			}
			push.log(' ');
		});

		push.accept();
	});

	repos.on('fetch', (fetch) => {
		console.log(`username ${fetch.username}`);
		console.log(`fetch ${fetch.repo}/${fetch.commit}`);
		fetch.accept();
	});
}
