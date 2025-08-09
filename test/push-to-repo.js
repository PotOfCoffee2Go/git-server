const { command } = require('./lib/spawn');
const hue = (txt, nbr=45) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

exports.pushToRepo = function pushToRepo(test, config) {
	const { testName, workDir, repoUrl } = test;
	console.log(hue(`\n----- Start ${testName} -----\n`)); 
	return command({cmd:'git', params:['log', '--oneline', '--graph', '--decorate', '--all', '-n 12'], workDir})
		.then(() => command({cmd:'git', params:['push', '-u', 'origin', 'main'], workDir}))
		.then(() => command({cmd:'git', params:['log', '--oneline', '--graph', '--decorate', '--all', '-n 12'], workDir}))
	.then(() => console.log(hue(`\n----- End ${testName} -----\n`)))
	.catch((exitcode) => console.error(hue(`Error code: ${exitcode}`,9)));
}
