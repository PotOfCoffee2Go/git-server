const { command } = require('./lib/spawn');
const hue = (txt, nbr=45) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;
const defaultNmae = 'Push commit(s) to repository';

exports.workPush = function workPush(test, config) {
	const { testName, workDir, repoUrl, remote, branch } = test;
	console.log(hue(`\n----- Start ${testName ? testName : defaultNmae} -----\n${__filename}`));
	console.dir(test);
	return command({cmd:'git', params:['log', '--oneline', '--graph', '--decorate', '--all', '-n 6'], workDir})
		.then(() => command({cmd:'git', params:['push', '-u', remote, branch], workDir}))
		.then(() => command({cmd:'git', params:['remote', 'show', remote], workDir}))
		.then(() => command({cmd:'git', params:['log', '--oneline', '--graph', '--decorate', '--all', '-n 6'], workDir}))
	.then(() => console.log(hue(`\n----- End ${testName ? testName : defaultNmae} -----\n`)))
	.catch((exitcode) => console.error(hue(`Error code: ${exitcode}`,9)));
}
