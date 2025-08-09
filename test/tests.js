const fs = require('fs-extra');
const os = require('node:os');
const path = require('node:path');
const hue = (txt, nbr=45) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

const packageDir = (fpath) => path.resolve(os.homedir(), '.git-server', fpath);

const { repoServer } = require('../lib/reposerver');

const { createWorkDirectory } = require('./create-work-directory');
const { pushToRepo } = require('./push-to-repo');

// Remove previous test runs and initialise for new tests
fs.removeSync(packageDir('tests'));
fs.ensureDirSync(packageDir('tests/working'));
fs.ensureDirSync(packageDir('tests/log'));
fs.copySync('testrepos.js', packageDir('tests/testrepos.js'));
const configPath = packageDir('tests/testrepos.js');

// Load config
const config = require(configPath).config();
config.pkgDir = process.cwd();
config.reposBase = path.parse(configPath).name;
config.server = {};

// Insure config is version 1
if (config.layout !== 'v1') {
	console.log(hue(`Unknown configuration layout: "${layout}"`,9));
	console.log('Must be layout "v1" for git-server v${pkg.version}');
	process.exit(1);
}

function stopGitServer() {
		config.server.repos.close();
		console.log(hue(`----- Stopped git-server running on port ${config.repoPort} -----`));
		return Promise.resolve(true);
}

var test = {
	testName: 'Create working directory and commit a package.json',
	workDir: packageDir('tests/working'),
	repoUrl: 'http://localhost:8005/test1.git',
}

process.chdir(path.dirname(configPath));
console.log(hue(`----- Start git-server on port ${config.repoPort} -----`));
repoServer(config, true)// like a restart - no REPL
	.then(() => createWorkDirectory(test, config))
	.then(() => {
		test.testName = 'Initial push to repository'
		return pushToRepo(test, config);
	})
	.then(() => stopGitServer())
