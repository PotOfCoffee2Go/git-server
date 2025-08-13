const { command } = require('./lib/spawn');
const hue = (txt, nbr=45) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;
const defaultNmae = 'Create repository';

exports.createWork = function createWork(test, config) {
	const { testName, workDir, repoUrl, remote, branch } = test;
	console.log(hue(`\n----- Start ${testName ? testName : defaultNmae} -----\n${__filename}`));
	console.dir(test);
	return command({cmd:'git', params:['init', '-b', branch], workDir})
		.then(() => command({cmd:'git', params:['remote', 'add',  remote,  repoUrl], workDir}))
		.then(() => command({cmd:'git', params:['remote', 'show', remote], workDir}))
		.then(() => command({cmd:'git', params:['status'], workDir}))
	.then(() => console.log(hue(`\n----- End ${testName ? testName : defaultNmae} -----\n`)))
	.catch((exitcode) => console.error(hue(`Error code: ${exitcode}`,9)));
}
