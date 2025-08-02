// You Can Use The Commands Below To Generate A Self Signed Certificate For Use by the git server
// These Commands Require That You have 'openssl' installed on your system
// openssl genrsa -out privatekey.pem 1024
// openssl req -new -key privatekey.pem -out certrequest.csr
// openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

// ---------
// Configuration

// Recommend leaving as 'http'
//  - will be localhost so access only allowed from machine running the server
const protocol = 'http'; // or https
const port = 7005;
const key = null;  // key: fs.readFileSync(path.resolve(__dirname, 'privatekey.pem')),
const cert = null; // cert: fs.readFileSync(path.resolve(__dirname, 'certificate.pem')),

// Directory that contains the repositories
const repoDir = './repos';

// Proxy server front-ends the repo server - network access is thru the proxy
const allowNetworkAccess = true; // false = do not start proxy server
const proxyhost = '0.0.0.0';
const proxyport = 8090; // note - is eighty-'ninety'

// users.json - if exists else use demo users
// Format of data in the JSON file is array of user/passwords as shown below
var users = fs.existsSync('./users.json') ? require('./users.json') : false;
if (!users) {
	users = [ 
		{ "name": "jane", "password": "do3" },
		{ "name": "roger", "password": "m00re" },
		{ "name": "42", "password": "42" }
	];
}

// ---------
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
	if (type == 'push') { // only authenticated users allowed to push
		user((username, password) => {
			if (users && auth(users, username, password)) {
				next();
			} else {
				next(hue('wrong password',9));
			}
		});
	} else { // not a push - so allow all user access to git command
		next();
	}
}

// ---------
// Servers
// Proxy server allows access by network devices
if (allowNetworkAccess) {
	const http = require('http')
	const httpProxy = require('http-proxy');

	httpProxy.createProxyServer({target:'http://localhost:7005'})
		.listen({host: proxyhost, port: proxyport});
	console.log(hue(`Proxy server on http://${os.hostname()}:${proxyport} -> http://localhost:${port}`));
}

// Repo server
const repoPath = path.normalize(path.resolve(repoDir));
const { Git: Server } = require('node-git-server');
const repos = new Server(repoPath, { authenticate, autoCreate: true });

repos.listen( port, { type: protocol, key, cert }, (error) => {
	if (error) {
		return console.error(hue(`failed to start git-server because of error ${error}`));
	}
	console.log(hue(`node-git-server running at ${protocol}://localhost:${port}`));
	console.log(hue(`Repositories in directory: ${repoPath}`));
	repos.list((err, result) => {
		if (!result) {
			console.log('No repositories available...');
		} else {
			console.log(result);
		}
	});
});

// ---------
// git command / event listeners
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
