const fs = require('fs-extra');
const os = require('node:os');
const path = require('node:path');
const hue = (txt, nbr=45) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

const packageDir = (fpath) => path.resolve(os.homedir(), '.git-server', fpath);

const { repoServer } = require('../lib/reposerver');

const { createWork } = require('./create-work');
const { workCommit } = require('./work-commit');
//const { createWork2MainPull } = require('./create-work2-main-pull');
const { createPackageJson } = require('./create-package-json');
const { workPush } = require('./work-push');

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
		console.log(hue(`----- Shutdown git-server http://localhost:${config.repoPort} -----`));
		return Promise.resolve(true);
}

function basicPush() {
	console.log(hue(`----- Start git-server on port ${config.repoPort} -----`));
	return repoServer(config, true)// like a restart - no REPL
		.then(() => createWork(test, config))
		.then(() => createPackageJson(test, config))
		.then(() => workCommit(test, config, "chore: add package.json"))
		.then(() => workPush(test, config))
		.then(() => stopGitServer())
}

var test = {
//	testName: '', // overrides defalut test name
	repoUrl: 'http://localhost:8005/test1.git',
	workDir: packageDir('tests/working'),
	remote: 'origin',
	branch: 'main',
}

process.chdir(path.dirname(configPath));
basicPush();
