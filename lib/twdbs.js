/*\
 * Start up TiddlyWiki Dashboard wiki
 * author: PotOfCoffee2Go
 * license: MIT
\*/

const fs = require('fs-extra');
const os = require('node:os');
const path = require('node:path');
const $tw = require('tiddlywiki').TiddlyWiki();
const { checkConfig }  = require('./checkconfig');
const handler = require('./web/handler');

const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

const setText = (title, text, fld='text') =>  $tw.wiki.setText(title, fld, null, text);

const programDir = (fpath) => path.join(__dirname, '..', fpath);
const packageDir = (fpath) => path.join(os.homedir(), '.git-server', fpath);

exports.twdbs = function twdbs($rt) {
	return new Promise((resolve, reject) => {
/*		var dir = packageDir('dbs');
		fs.ensureDirSync(dir);

		if (fs.readdirSync(dir).length === 0) {
			console.log(hue('Copying default git-server dbs wiki to ~/.git-server/dbs',193));
			fs.copySync(programDir('wiki/dbs'), dir);
		}
*/
		$tw.boot.argv = [programDir('wiki/dbs')]; // TW output dir
		$tw.boot.boot(() => {
			$tw.syncer.logger.enable = false;
		});

		var tiddler = Object.assign({}, $tw.wiki.getTiddler('git-server-config').fields);
		var config = checkConfig(tiddler);

		console.dir(config);

		$tw.web = { handler, config };
		$rt.context.$tw = $tw;

		var params = { port: config.twdbsPort + '', 'path-prefix': '/dashboard' };

		$tw.hooks.addHook('th-server-command-post-start', (server, nodeServer) => {
			console.log(hue(`\nTiddlyWiki Dashboard started: ` +
				`http://localhost:${params.port}${params['path-prefix']}`));
			resolve($rt);
		});


		var twserver = new $tw.commands.listen.Command(params, $tw);
		twserver.execute();
	})
}
