/*\
 * Handles Git-server requests from TiddlyWiki Dashboard
 * 
 * repo: https://github.com/PotOfCoffee2Go/git-server.git
 * author: PotOfCoffee2Go
 * license: MIT
\*/
"use strict";

const route = 'git-server';
var reqCounter = 1;

const hue = (txt, nbr=45) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

const { run } = require('./run');
const { commands } = require('./commands');
const { branches } = require('./branches');
const setText = ($tw, title, text, fld='text') =>  $tw.wiki.setText(title, fld, null, text);

// Called by $__poc2go_modules_custom_server_route.js tiddler
module.exports = async function webHandler($tw, request, response, state) {
	// DecodeURI special characters in params
	const params = decodeUriParams(state);

	// Assign params to friendly names
	const topic = params[0], filter = params[1], sender = params[2];

	var settings = $tw.wiki.getTiddler('git-server-settings').fields;
	const commandRef = commands($tw, settings);

	// Result of git commands
	var out = '';
	
	// Process the topic
	switch (topic) {
		case 'commands':
			await topicCommands();		
			break;
		case 'resetTiddlers':
			deleteServerTiddlers();
			reqCounter = 1;
			break;
		default:
			out += `Error: unknown topic '${topic}'`;
	}

	setText($tw, 'git-server-command-output',
		`@@.mono-m ${settings.command}@@ \n\n` +
		'```\n' + out + '\n```\n\n');

	await branches($tw, settings);

	// The response is nt used since the wiki tiddlers are updated
	//  to reflect any actions taken

	// Values of this request
	// Responding with those values for debugging
	const urlValues = { route, topic, filter, sender };
	const jsonResponse = { urlValues }

	// Respond with JSON of results for this topic
	state.sendResponse(200, {"Content-Type": "application/json"},
		JSON.stringify(jsonResponse)
	);

	// ----------------
	// Topic processing
	async function topicCommands() {
		var didCmd = false;
		// Is a sequence of commandss
		if (commandRef[settings.command]) {
			for (const cmd of commandRef[settings.command]) {
				out += `$ ${cmd}\n`;
				await run(cmd, {cwd: settings.workDir})
					.then((stdout) => { out += stdout; })
				.catch((err) => { out += err;});
				didCmd = true;
			}
		}

		// Is a single command
		if (!didCmd) {
			var cmd = settings.command;
			out += `$ ${cmd}\n`;
			await run(cmd, {cwd: settings.workDir})
				.then((stdout) => { out += stdout; })
			.catch((err) => { out += err;});
		}
	}


	// ----------------
	// Helpers
	function decodeUriParams(state) {
		const params = [];
		state.params[0].split('/').forEach(p => {
			params.push($tw.utils.decodeURIComponentSafe(p));
		})
		return params;
	}

	function deleteServerTiddlers() {
		const tiddlers = $tw.wiki.filterTiddlers('[prefix[Server Tiddler #]]');
		$tw.each(tiddlers,function(title) {
			$tw.wiki.deleteTiddler(title);
		});
	}
}
