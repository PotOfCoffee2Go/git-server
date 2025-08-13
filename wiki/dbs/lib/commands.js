
exports.commands = function commands($tw, settings) {
	var commandsRaw = $tw.wiki.getTiddlerText('git-server-commands');
	commandsRaw = '`' + commandsRaw.replace(/\`\`\`/g, '') + '`';
	var cc = eval(commandsRaw);
	cc = cc.split('\n');
	
	const commands = {}, options = [];
	var curcc = '';
	for (let i=0; i<cc.length; i++) {
		if (!cc[i]) { continue; }
		if (!/^git/.test(cc[i])) {
			curcc = cc[i];
			commands[curcc] = [];
			options.push(`<option>${curcc}</option>`)
			continue;
		}
		commands[curcc].push(cc[i]);
	}
	
	$tw.wiki.addTiddler({
		title: 'git-server-command-options',
		text: 
		`<$select tiddler='git-server' field='command' tooltip='Choose a new site title'>\n` +
		options.join('/n') +
		`</$select>\n\n`
	});
	
	return commands;
}
