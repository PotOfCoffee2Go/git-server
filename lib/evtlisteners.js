/*\
 * Git-server events - 'push', 'pull', 'fetch', etc are possible
 * 
 * repo: https://github.com/PotOfCoffee2Go/git-server.git
 * author: PotOfCoffee2Go
 * license: MIT
\*/
const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

exports.eventListeners = function eventListeners(repos, config) {
	const { reposBase, repoPort, proxyPort, allowNetworkAccess, allowAnonymous, users } = config;

	// --------------------------------
	// Examples of git command event listeners
	repos.on('push', (push) => {
		console.log(`push ${push.repo} / ${push.commit} ( ${push.branch} )`);
		repos.list((err, results) => {
			push.log(' ');
			push.log('Other repositories on this server:');
			for (const repo of results) {
				push.log(`- ${repo}`);
			}
			push.log(' ');
		});

		push.accept();
	});

	repos.on('fetch', (fetch) => {
		console.log(`username ${fetch.username ? fetch.username : 'anonymous'}`);
		console.log(`fetch ${fetch.repo}/${fetch.commit}`);
		fetch.accept();
	});
}
