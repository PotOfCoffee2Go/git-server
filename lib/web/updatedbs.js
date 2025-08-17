
const { run } = require('./run');
const { fileStatesLookup } = require('./filestates');

const setText = ($tw, title, text, fld='text') =>  $tw.wiki.setText(title, fld, null, text);

exports.updateDbs = async function updateDbs($tw, settings) {
	var gitSt = '', error = '';
	await run('git status -s -b', {cwd: settings.workDir})
		.then((stdout) => { gitSt = stdout; })
	.catch((err) => { error = err;});

	if (error) {
		console.log('Update status error: ' + error);
		return error;
	}
	
	gitSt = gitSt.split('\n');
	// Determine if branch is being pushed to remote
	var isPushable, remote, branch;
	if (gitSt[0].substring(0,2) === '##') {
		gitSt[0] = gitSt[0].substring(3);
		if (gitSt[0].split('...').length === 2) {
			remote = gitSt[0].split('...')[1].split('/')[0];
			branch = gitSt[0].split('...')[1].split('/')[1];
			isPushable = true;
			console.log(`can push ${branch} to ${remote}`);
		} else {
			branch = gitSt[0];
			isPushable = false;
			remote = settings.remote;
			console.log(`can not push ${branch} as not tracked by ${remote}`);
		} 
	}
	// remove branch info
	gitSt.shift(); gitSt.pop(0);

	var fileStates = [];
	gitSt.forEach(st => { 
		let fileState = { file: st.substring(3), index: st[0], tree: st[1] };
		let stateText = fileStatesLookup($tw, settings, fileState);
		fileStates.push({
			file: st.substring(3), index: st[0], tree: st[1],
			stateText: stateText 
		});
	})
	console.dir(fileStates);
	var tbl = ['| tracking | file | index | work |h'];
	fileStates.forEach(st => {
		tbl.push(`|${st.stateText.track} |${st.stateText.file} |${st.stateText.index} |${st.stateText.work} |`);
	})
	setText($tw, 'git-server-files-status', tbl.join('\n') + 
	`\n<details><summary>@@.mono-m Commit@@ </summary>\n\n{{git-server-settings-commit}}\n\n</details>\n` );
/*	
	setText($tw, 'git-server-branches',
		`<$select tiddler='git-server-settings' field='branch' default='${selected}' tooltip='Choose a branch'>\n` +
		options.join('/n') +
		`</$select>\n\n`
	);

	setText($tw, 'git-server-settings', `${selected}`, 'branch');
*/
}
