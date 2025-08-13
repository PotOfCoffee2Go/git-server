const fs = require('fs-extra');
const os = require('node:os');
const path = require('node:path');
const hue = (txt, nbr=45) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

const packageDir = (fpath) => path.resolve(os.homedir(), '.git-server', fpath);

const { loadConfig } = require('../lib/loadconfig');
const { checkRepoServer } = require('./lib/checkreposerver');

const { createWork } = require('./create-work');
const { workCommit } = require('./work-commit');
const { createPackageJson } = require('./create-package-json');
const { workPush } = require('./work-push');
const { cloneWork } = require('./clone-work');
const { updatePackageJson } = require('./update-package-json');
const { checkoutNewBranch } = require('./checkout-new-branch');
const { checkoutBranch } = require('./checkout-branch');

// Remove previous test runs and initialise for new tests
fs.removeSync(packageDir('tests'));
fs.ensureDirSync(packageDir('tests/working'));
fs.ensureDirSync(packageDir('tests/log'));
fs.copySync('testrepos.js', packageDir('tests/testrepos.js'));

// Load config
const configPath = packageDir('tests/testrepos.js');
const config = loadConfig(configPath);

function basicPush() {
	return checkRepoServer(config, packageDir('tests/testrepos.js'))
		.then(() => createWork(test, config))
		.then(() => createPackageJson(test, config))
		.then(() => workCommit(test, config, "chore: add package.json"))
		.then(() => workPush(test, config))
		.then(() => cloneWork(clone, config))
		.then(() => updatePackageJson(clone, config))
		.then(() => workPush(clone, config))
		.then(() => checkoutNewBranch(clonebr, config))
	.catch((exitcode) => console.error(hue(`Error code: ${exitcode}`,9)));
}

var test = {
//	testName: '', // overrides defalut test name
	repoUrl: 'http://localhost:8005/test1.git',
	workDir: packageDir('tests/working'),
	remote: 'origin',
	branch: 'main',
}

var clone = {
	repoUrl: 'http://localhost:8005/test1.git',
	workDir: packageDir('tests/workclone'),
	remote: 'origin',
	branch: 'main',
	
}
var clonebr = {
	repoUrl: 'http://localhost:8005/test1.git',
	workDir: packageDir('tests/workclone'),
	remote: 'origin',
	branch: 'develop',
	
}
process.chdir(path.dirname(configPath));
basicPush();
