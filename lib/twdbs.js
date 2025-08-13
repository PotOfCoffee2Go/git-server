/*\
 * Get settings from .twgist/dbs TiddlyWiki
 * version: 1.0.0
 * created: 2025-07-19
 * author: PotOfCoffee2Go
 * license: MIT
\*/

const fs = require('fs-extra');
const os = require('node:os');
const path = require('node:path');
const $tw = require('tiddlywiki').TiddlyWiki();

const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

const programDir = (fpath) => path.join(__dirname, '..', fpath);
const packageDir = (fpath) => path.join(os.homedir(), '.git-server', fpath);

exports.twdbs = function twdbs(config) {
	return new Promise((resolve, reject) => {
		var dir = packageDir('dbs');
		fs.ensureDirSync(dir);

		if (fs.readdirSync(dir).length === 0) {
			console.log(hue('Copying default git-server dbs wiki to ~/.git-server/dbs',193));
			fs.copySync(programDir('wiki/dbs'), dir);
		}

		$tw.boot.argv = [programDir('wiki/dbs')]; // TW output dir
		$tw.boot.boot(() => {
			$tw.syncer.logger.enable = false;
		});
		config.server.$tw = $tw;
		resolve('');

		var params = { port: '8082' };
		var twserver = new $tw.commands.listen.Command(params, $tw);
		twserver.execute();
	})
}
