/*\
 * Git-server REPL commands
 * 
 * repo: https://github.com/PotOfCoffee2Go/git-server.git
 * author: PotOfCoffee2Go
 * license: MIT
\*/
const os = require('node:os');
const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

const { repoServer } = require('./reposerver');

// ---- REPL ----
var $rt;
exports.init = function init() {
	const prompt = '' // no prompt on startup
	$rt = require('node:repl').start({ prompt, ignoreUndefined: true });

	// REPL context - Working $tw(s) and client sockets
	function replContext() {
		$rt.context.$rt = $rt;	// the REPL itself
	}
	$rt.on('reset', () => {
		replContext();
	})

	$rt.defineCommand('dir', {
		help: `Display object '.dir object,n' where n = depth - default: 1`,
		action(params) {
			$rt.clearBufferedCommand();
			var p = params.split(',');
			if (!p[0]) {
				p[0] = '$tw.web.config';
				console.log(hue('$tw.web.config'));
			}
			var obj;
			try {
				obj = eval('$rt.context.' + p[0]);
			} catch(e) {
				console.log(undefined);
				$rt.displayPrompt();
				return;
			}
			
			if (p.length > 1) {
				console.dir(obj,{depth:p.pop()});
			} else {
				console.dir(obj,{depth:1});
			}
			$rt.displayPrompt();
		}
	});

	$rt.defineCommand('clear', {
		help: `Unable to .clear context - restart application instead`,
		action(params) {
			$rt.clearBufferedCommand();
			console.log(hue(`Unable to .clear context - restart application instead`,9));
			console.log(hue(`Context not cleared`,9));
			$rt.displayPrompt();
		}
	});
/*	
	$rt.defineCommand('restart', {
		help: `Shutdown and restart repo and proxy servers`,
		action(params) {
			$rt.clearBufferedCommand();
			const servers = $rt.context.$tw.web.config.server;
			servers.proxy.close()
			servers.repos.close()
				.then(() => repoServer($rt.context.$tw.web.config, true)) // restart
				.then(() => $rt.displayPrompt())
		}
	});
*/
	replContext();
	return $rt;
}

exports.start = function start() {
	const config = $rt.context.$tw.web.config;
	$rt.setPrompt(
		hue('git-server',111) + 
		hue('@',109) + hue(os.hostname,111) +
		hue('(',109) + hue(config.reposBase,111) + hue(')',109) +
		hue('> ',109)
	);
	console.log(hue(`type '.help' for list of commands'`,38));
	console.log(hue('(press ctrl-c multiple times to exit)',38));
	$rt.displayPrompt();
}
