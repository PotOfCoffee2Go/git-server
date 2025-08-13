const { command } = require('./lib/spawn');
const hue = (txt, nbr=45) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;
const defaultNmae = 'Commit changes';

exports.workCommit = function workCommit(test, config, msg='Commit') {
	const { testName, workDir, repoUrl, remote, branch } = test;
	msg = `"${msg}"`; // Windoes and Liunux treat quotes differently - so needs the quotes
	console.log(hue(`\n----- Start ${testName ? testName : defaultNmae} -----\n${__filename}`));
	console.dir(test);
	return command({cmd:'git', params:['status'], workDir})
		.then(() => command({cmd:'git', params:['add', '.'], workDir}))
		.then(() => command({cmd:'git', params:['status'], workDir}))
		.then(() => command({cmd:'git', params:['commit', '-m', msg], workDir}))
		.then(() => command({cmd:'git', params:['status'], workDir}))
		.then(() => command({cmd:'git', params:['log', '--oneline', '--graph', '--decorate', '--all', '-n 6'], workDir}))
	.then(() => console.log(hue(`\n----- End ${testName ? testName : defaultNmae} -----\n`)))
	.catch((exitcode) => console.error(hue(`Error code: ${exitcode}`,9)));
}
