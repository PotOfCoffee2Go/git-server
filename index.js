const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// --------------------------------
// Start of Configuration

// Directory that contains the repos
// Automatically created if not present
const repoDir = './repos';

// Repo server
const port = 7005;

// Proxy server - network access is thru the proxy
const proxyport = 7000;

// allowNetworkAccess equals true = the proxy server will be started
const allowNetworkAccess = true; // false = do not start proxy server

// allowAnonymousPush equals true = user/password checking will NOT BE PERFORMED!
const allowAnonymousPush = true; // false - require user/password to 'push'

// If allowAnonymousPush equals false - check user/passwords
// Use 'users.json' file if exists else use default users listed below
// Format of data in the JSON file is array of user/passwords as shown below
var users = fs.existsSync('./users.json') ? require('./users.json') : false;
if (!users) {
	users = [ 
		{ "name": "jane", "password": "do3" },
		{ "name": "roger", "password": "m00re" },
		{ "name": "42", "password": "42" }
	];
}

// End of configuration
// --------------------------------

// --------------------------------
// Helpers
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

console.log(`Anonymous 'push' is ${allowAnonymousPush ? 'allowed' : 'not allowed'}`);
console.log(`Access from other devices on network is ${allowNetworkAccess ? 'allowed' : 'not allowed'}`);
console.log('');

// --------------------------------
// Servers

// Proxy server allows access by network devices
const proxyServer = () => {
	if (allowNetworkAccess) {
		const httpProxy = require('http-proxy');
		httpProxy.createProxyServer({ target:`http://localhost:${port}` })
			.listen({host: '0.0.0.0', port: proxyport});
		console.log(hue(`Proxy server running at http://${os.hostname()}:${proxyport} -> http://localhost:${port}`));
	}
}

// Repo server
const repoPath = path.normalize(path.resolve(repoDir));
const { Git: Server } = require('node-git-server');
const repos = new Server(repoPath, { authenticate, autoCreate: true });

repos.listen( port, { type: 'http' }, (error) => {
	if (error) {
		return console.error(hue(`failed to start git-server because of error ${error}`));
	}
	console.log(hue(`Repositories in directory: ${repoPath}`));
	console.log(hue(`git-server running at http://localhost:${port}`));
	proxyServer();
	repos.list((err, result) => {
		if (!result) {
			console.log('No repositories available...');
		} else {
			console.log(result);
		}
		console.log(hue('(press ctrl-C to exit)',9));
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
