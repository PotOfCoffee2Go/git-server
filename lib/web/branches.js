
const { run } = require('./run');

const setText = ($tw, title, text, fld='text') =>  $tw.wiki.setText(title, fld, null, text);

exports.branches = async function branches($tw, settings) {
	var gitBr = '', error = '';
	await run('git branch', {cwd: settings.workDir})
		.then((stdout) => { gitBr = stdout; })
	.catch((err) => { error = err;});

	if (error) {
		console.log('Branches list error: ' + error);
		return error;
	}
	
	var options = [], selected;
	gitBr = gitBr.split('\n');
	gitBr.forEach(br => {
		if (br) {
			if (br[0] === '*') {
				selected = br.substring(2);
			}
			options.push(`<option>${br.substring(2)}</option>`)
		}
	})
	
	setText($tw, 'git-server-branches',
		`<$select tiddler='git-server-settings' field='branch' default='${selected}' tooltip='Choose a branch'>\n` +
		options.join('/n') +
		`</$select>\n\n`
	);

	setText($tw, 'git-server-settings', `${selected}`, 'branch');

	await run('git remote', {cwd: settings.workDir})
		.then((stdout) => { gitrm = stdout; })
	.catch((err) => { error = err;});

	if (error) {
		console.log('Branches list error: ' + error);
		return error;
	}
	
	options = [], selected;
	gitrm = gitrm.split('\n');
	gitrm.forEach(rm => {
		if (rm) {
			options.push(`<option>${rm}</option>`)
		}
	})
	
	setText($tw, 'git-server-remotes',
		`<$select tiddler='git-server-settings' field='remote' tooltip='Choose a remote'>\n` +
		options.join('/n') +
		`</$select>\n\n`
	);
}
