const os = require('node:os');

const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

// ---- REPL ----
exports.repl = function repl(config) {
	const prompt = hue('git-server',111) + 
		hue('@',109) + hue(os.hostname,111) +
		hue('(',109) + hue(config.repoDir,111) + hue(')',109) +
		hue('> ',109);

	const $rt = require('node:repl').start({ prompt, ignoreUndefined: true });

	// REPL context - Working $tw(s) and client sockets
	function replContext() {
		$rt.context.$rt = $rt;	// the REPL itself
		$rt.context.$config = config;
	}
	$rt.on('reset', () => {
		replContext();
	})

	$rt.defineCommand('dir', {
	  help: `Display object '.dir object,n' where n = depth - default: 1`,
	  action(params) {
		this.clearBufferedCommand();
		var p = params.split(',');
		if (!p[0]) {
			p[0] = '$config';
			console.log(hue('$config'));
		}
		var obj;
		try {
			obj = eval('$rt.context.' + p[0]);
		} catch(e) {
			console.log(undefined);
			this.displayPrompt();
			return;
		}
		
		if (p.length > 1) {
			console.dir(obj,{depth:p.pop()});
		} else {
			console.dir(obj,{depth:1});
		}
		this.displayPrompt();
	  },
	});

	replContext();
}
