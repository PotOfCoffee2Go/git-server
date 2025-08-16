/*\
 * Start up TiddlyWiki Dashboard wiki and load config
 * author: PotOfCoffee2Go
 * license: MIT
\*/
const path = require('node:path');
const $tw = require('tiddlywiki').TiddlyWiki();
const { checkConfig }  = require('./checkconfig');
const handler = require('./web/handler');

const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;
const programDir = (fpath) => path.join(__dirname, '..', fpath);

// TiddlyWiki Dashboad Server
exports.twdbs = function twdbs($rt) {
	return new Promise((resolve, reject) => {
		// Boot TW Dashboard wiki - tiddlywiki.info will load WebServer
		$tw.boot.argv = [programDir('wiki/dbs')]; // TW output dir
		$tw.boot.boot(() => {
			$tw.syncer.logger.enable = false; // No annoying syncer msgs
		});

		// Get config - check it - and place references in REPL context
		var tiddler = Object.assign({}, $tw.wiki.getTiddler('git-server-config').fields);
		var config = checkConfig(tiddler);
		$tw.web = { handler, config };
		$rt.context.$tw = $tw;

		// Set --listen command options
		var params = { port: config.twdbsPort + '', 'path-prefix': '/dashboard' };

		// Setup hook that let's us know the wiki is started
		$tw.hooks.addHook('th-server-command-post-start', (server, nodeServer) => {
			console.log(hue(`\nTiddlyWiki Dashboard started: ` +
				`http://localhost:${params.port}${params['path-prefix']}`));
			resolve($rt);
		});

		// Start the TiddlyWiki Dashboard (--listen)
		var twserver = new $tw.commands.listen.Command(params, $tw);
		twserver.execute();
	})
}
