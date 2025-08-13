const { command } = require('./lib/spawn');
const hue = (txt, nbr=45) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;
const defaultNmae = 'Update package.json - add packages/package.json - commit';

exports.updatePackageJson = function updatePackageJson(test, config) {
	const { testName, workDir, repoUrl, remote, branch } = test;
	console.log(hue(`\n----- Start ${testName ? testName : defaultNmae} -----\n${__filename}`));
	console.dir(test);
	return command({cmd:'git', params:['status'], workDir})
		.then(() => command({cmd:'git', params:['log', '--oneline', '--graph', '--decorate', '--all', '-n 6'], workDir}))
		.then(() => command({cmd:'npm', params:['init', '-y', '-w', 'packages'], workDir}))
		.then(() => command({cmd:'git', params:['status'], workDir}))
		.then(() => command({cmd:'git', params:['add', 'packages/package.json'], workDir}))
		.then(() => command({cmd:'git', params:['status'], workDir}))
		.then(() => command({cmd:'git', params:['commit', '-am', `"feat: update & add package.json's"`], workDir}))
		.then(() => command({cmd:'git', params:['status'], workDir}))
		.then(() => command({cmd:'git', params:['log', '--oneline', '--graph', '--decorate', '--all', '-n 6'], workDir}))
	.then(() => console.log(hue(`\n----- End ${testName ? testName : defaultNmae} -----\n`)))
	.catch((exitcode) => console.error(hue(`Error code: ${exitcode}`,9)));
}
