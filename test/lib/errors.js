exports.errors = function errors(test, options, exitcode, testTitle) {
	const { cmd, params, workDir } = options;
	console.error(hue(`Error code: ${exitcode}`,9)));
}
