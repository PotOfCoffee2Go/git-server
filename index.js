// --------------------------------
// Start of Configuration

// Directory that contains the repos
// if does not exist - will be created on first 'push'
const repoDir = './repos';

// Repo server - performs the git commands
// Is only available to 'localhost'
const port = 7005;

// Proxy server - network access is thru the proxy
const proxyport = 7000;

// allowNetworkAccess equals true - the proxy server will be started
const allowNetworkAccess = false; // false = do not start proxy server

// allowAnonymousPush equals true - user/password checking will NOT BE PERFORMED!
const allowAnonymousPush = true; // false - require user/password to 'push'

// User / passwords - only used when allowAnonymousPush = false;
const users = [
	{ "name": "jane", "password": "do3" },
	{ "name": "roger", "password": "m00re" },
	{ "name": "42", "password": "42" },
];

// End of configuration
// --------------------------------

// --------------------------------
// Fire up git-server
const config = { repoDir, port, proxyport, allowNetworkAccess, allowAnonymousPush, users };
const { repoServer } = require('./lib/reposerver');
repoServer(config);
// --------------------------------
