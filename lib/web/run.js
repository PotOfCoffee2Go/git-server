const { exec } = require('node:child_process');

exports.run = function run(cmd, args) {
	return new Promise((resolve, reject) => {
		exec(cmd, { ...args, timeout: 10000 }, (err, stdout, stderr) => {
			if (err) { return reject(err); }
			if (stderr) { return reject(stderr); }
			resolve(stdout);
		});
	});
}
