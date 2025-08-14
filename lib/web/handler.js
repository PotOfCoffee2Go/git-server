/*\
title: $:/poc2go/modules/custom/server/route.js
type: application/javascript
module-type: route

Server-side custom WebServer route

GET /{route}/topic/filter/sender

\*/
"use strict";

const route = 'git-server';
var reqCounter = 1;

const hue = (txt, nbr=45) => `\x1b[38;5;${nbr}m${txt}\x1b[0m`;

const { exec } = require('node:child_process');
const { commands } = require('./commands');

module.exports = async function webHandler($tw, request, response, state) {
	const setText = (title, text, fld='text') =>  $tw.wiki.setText(title, fld, null, text);

	// DecodeURI special characters in params
	const params = decodeUriParams(state);

	// Assign params to friendly names
	const topic = params[0], filter = params[1], sender = params[2];

	var settings = $tw.wiki.getTiddler('git-server-settings').fields;
	const commandRef = commands($tw, settings);

	var out = '';
	
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

	setText('git-server-command-output',
		`@@.mono-m ${settings.command}@@ \n\n` +
		'```\n' + out + '\n```\n\n');

	// Values of this request
	// Responding with those values
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
		if (commandRef[settings.command]) {
			for (const cmd of commandRef[settings.command]) {
				out += `$ ${cmd}\n`;
				await run(cmd, {cwd: settings.workDir})
					.then((stdout) => { out += stdout; })
				.catch((err) => { out += err;});
				didCmd = true;
			}
		}

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

	function tiddlerToWiki(jsonTiddler) {
		$tw.wiki.addTiddler(new $tw.Tiddler(
			$tw.wiki.getCreationFields(),
			jsonTiddler,
			$tw.wiki.getModificationFields(),
		));
	}

	function deleteServerTiddlers() {
		const tiddlers = $tw.wiki.filterTiddlers('[prefix[Server Tiddler #]]');
		$tw.each(tiddlers,function(title) {
			$tw.wiki.deleteTiddler(title);
		});
	}

	function run(cmd, args) {
		return new Promise((resolve, reject) => {
			exec(cmd, { ...args, timeout: 10000 }, (err, stdout, stderr) => {
				if (err) { return reject(err); }
				if (stderr) { return reject(stderr); }
				resolve(stdout);
			});
		});
	}
}
