/*\
 * A git-server configuration file
\*/
exports.config = function config() {
// Must be "v1" for current release of git-server
const layout = "v1";

// --------------------------------
// Start of Configuration

// Repository server comm port
// Performs the git commands 
// Is only available on 'localhost'
const repoPort = 7005;

// Proxy server comm port
// Routes git commands to port above
// Devices on network have access via this port
const proxyPort = 7000;

// Allow Network Access?
//  true  - the proxy server above will be started
//  false - the proxy server will not be started
const allowNetworkAccess = false;

// Allow writes to repositories for all requests 
//  true  - user/password in not required
//  false - user/password is required
const allowAnonymous = true;

// User/passwords to allow write to repositories 
// Required to 'git push' to repositories
//  when allowAnonymous = false;
const users = [
	{ "name": "jane", "password": "do3" },
	{ "name": "roger", "password": "m00re" },
	{ "name": "42", "password": "42" },
];

// End of configuration
// --------------------------------
return { repoPort, proxyPort, allowNetworkAccess, allowAnonymous, users, layout };
}
