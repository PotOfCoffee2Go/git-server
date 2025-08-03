const os = require('node:os');

const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

// Proxy server allows access by network devices
exports.proxyServer = function proxyServer(proxyPort, repoPort, allow) {
	if (allow) {
		const httpProxy = require('http-proxy');
		httpProxy.createProxyServer({ target:`http://localhost:${repoPort}` })
			.listen({host: '0.0.0.0', port: proxyPort});
		console.log(hue(`Proxy server running at http://${os.hostname()}:${proxyPort} -> http://localhost:${repoPort}`));
	}
}
