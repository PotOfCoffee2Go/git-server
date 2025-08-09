const os = require('node:os');
const { spawn } = require('node:child_process');

const hue = (txt, nbr=214) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;
const isWin32 = os.platform() === 'win32';

// Spawned processes display on parent's output
const spawnOptions = { stdio: ['pipe', process.stdout, process.stderr] };
if (isWin32) { spawnOptions.shell = true; }; // Windows requires shell to be true

// Spawn commands
exports.command = function command(options) {
	const { cmd, params, workDir } = options;
	return new Promise((resolve, reject) => {
		spawnOptions.cwd = workDir;
		console.log(hue(`\n${cmd} ${params.join(' ')}`));
		// trim laading/trailing quotes from commit msg unless Windows
		if (!isWin32 && params[0] === 'commit') { 
			  params[2] = params[2].slice(1, -1);
		}
		const spawned = spawn(cmd, params, spawnOptions);
		spawned.on('close', (exitcode) => {
			if (exitcode !== 0) {
				console.log(hue(`^^^ error: ${cmd} ` + params.join(' ') + ` ^^^\n`,9));
			}
			resolve(exitcode);
		})
	})
}
