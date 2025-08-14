/*\
 * Git-server load configuration
 * 
 * repo: https://github.com/PotOfCoffee2Go/git-server.git
 * author: PotOfCoffee2Go
 * license: MIT
\*/
const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

exports.checkConfig = function checkConfig(tiddler) {
	const {
		layout, twdbsPort, repoPort, proxyPort, 
		allowNetworkAccess, allowAnonymous
	} = tiddler;

	if (layout !== 'v1') {
		console.log(hue(`Unknown configuration layout: "${layout}"`,9));
		console.log('Must be layout "v1" for git-server v${pkg.version}');
		process.exit(1);
	}

	var config = {
		layout, twdbsPort, repoPort, proxyPort, 
		allowNetworkAccess, allowAnonymous
	};
	
	config.allowAnonymous = config.allowAnonymous === 'yes' ? true : false;
	config.allowNetworkAccess = config.allowNetworkAccess === 'yes' ? true : false;
	config.users = [];
	config.reposBase = 'repos';
	config.pkgDir = process.cwd();
	config.server = {};

	return config;
}
