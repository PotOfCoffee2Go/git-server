const fs = require('node:fs');
const path = require('node:path');

exports.parameters = function parameters() {

	var configModule = process.argv[2] || './repos.js';
	if (!/\.js$/.test(configModule)) {
		configModule = configModule + '.js';
	}

	const configPath = path.normalize(path.resolve(configModule));

	if (!fs.existsSync(configPath)) {
		console.log(hue(`Conguration file ${configPath} not found`,9));
		process.exit(2);
	}

	return { configPath };
}
