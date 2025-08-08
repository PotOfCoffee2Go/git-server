/*\
 * Proxy server to allow network access to git-server
 * 
 * repo: https://github.com/PotOfCoffee2Go/git-server.git
 * author: PotOfCoffee2Go
 * license: MIT
\*/
const os = require('node:os');

const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

// Proxy server allows access by network devices
exports.proxyServer = function proxyServer(config) {
	const { repoPort, proxyPort, allowNetworkAccess } = config;

	const httpProxy = require('http-proxy');
	const proxy = httpProxy.createProxyServer({ target:`http://localhost:${repoPort}` });
	config.server.proxy = proxy;

	if (allowNetworkAccess) {
		proxy.listen({host: '0.0.0.0', port: proxyPort});
		console.log(hue(`Proxy server running at http://${os.hostname()}:${proxyPort} -> http://localhost:${repoPort}`));
	}
}
